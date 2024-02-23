import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { arrowBack, settingSvg, closeIcon } from "../assets/svgs";
import * as amplitude from "@amplitude/analytics-browser";
import "./popup.css";
import {
  customFontFaceBold,
  customFontFaceMedium,
  customFontFaceLight,
} from "../utils/const";
import {createUrlWithGA4CampaignQueryParams} from "../utils/googleAnalytics";

const imageLogo = chrome.runtime.getURL("BLC_Logo.png");
const iconLogo = chrome.runtime.getURL("icon.png");

const Popup = () => {
  const [companyName, setCompanyName] = useState("");
  const [isSettingsPage, setIsSettingsPage] = useState(false);
  const [id, setId] = useState("");
  const [isEnabled, setIsEnabled] = useState<boolean>();

  const amplitudeKey = String(process.env["AMPLITUDE_API_KEY"]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "RetrieveSettings" },
      function (settingsResponse) {
        setIsEnabled(settingsResponse.isStatisticsEnabled);

        chrome.runtime.sendMessage(
          { message: "CheckDomains" },
          function (response) {
            if (response.url) {
              setId(response.id);
              setCompanyName(response.name);

              if (
                Boolean(settingsResponse.isStatisticsEnabled && response.name)
              ) {
                amplitude.init(amplitudeKey, {
                  defaultTracking: true,
                  serverZone: "EU",
                });

                const eventProperties = {
                  company_name: response.name,
                  offer_id: String(response.id),
                };

                amplitude.track(
                  "chrome_extension_offer_viewed",
                  eventProperties
                );
              }
            }
          }
        );
      }
    );
  }, []);

  const handleOfferClicked = () => {
    chrome.runtime.sendMessage(
      { message: "RetrieveSettings" },
      function (settingsResponse) {
        if (settingsResponse.isStatisticsEnabled) {
          amplitude.init(amplitudeKey, {
            defaultTracking: true,
            serverZone: "EU",
          });
          const eventProperties = {
            company_name: companyName,
            offer_id: String(id),
          };

          amplitude.track("chrome_extension_offer_clicked", eventProperties);
          setTimeout(() => {
            window.open(getOfferDetailsUrlWithGA4Params());
          }, 1000);
        } else {
            window.open(getOfferDetailsUrlWithGA4Params());
        }
      }
    );
  };

  const getOfferDetailsUrlWithGA4Params = () => {
    return createUrlWithGA4CampaignQueryParams(Number(id), companyName);
  };

  const toggleSwitch = () => {
    chrome.runtime.sendMessage(
      { message: "TriggerStatistics" },
      function (response) {
        setIsEnabled(response.isEnabled);
      }
    );
  };

  const switchStyle = {
    width: "60px",
    height: "30px",
    borderRadius: "40px",
    backgroundColor: isEnabled ? "#009" : "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: isEnabled ? "flex-end" : "flex-start",
    padding: "5px",
    cursor: "pointer",
  };

  const toggleStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "white",
    transition: "all 0.3s ease-in-out",
  };

  document.body.style.height =
    companyName || isSettingsPage ? "419px" : "465px";

  if (isSettingsPage) {
    return (
      <div className="discount-banner-container">
        <div className="discount-header-container">
          <div
            className="settings-box"
            onClick={() => setIsSettingsPage(false)}
          >
            {isSettingsPage ? arrowBack : settingSvg}
          </div>
          <img className="header-img" src={imageLogo} alt="logo" />
          <div className="settings-box" onClick={() => window.close()}>
            {closeIcon}
          </div>
        </div>
        <div className="settings-body">
          <p className="text-large" style={{ fontFamily: "BoldMuseoSansRounded" }}>Settings</p>
          <div className="settings-body-container">
            <p style={{ maxWidth: "70%" }}>
              By clicking on the switch box you allow BLC chrome extension to
              track of your usage.
            </p>
            <div onClick={toggleSwitch} style={switchStyle}>
              <div style={toggleStyle}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (companyName) {
    return (
      <div className="discountBannerContainer" id="notification-banner">
        <div className="discountHeaderContainer">
          <div className="headerContainer">
            <div
              className="settings-box"
              onClick={() => setIsSettingsPage(true)}
            >
              {settingSvg}
            </div>
            <img src={imageLogo} alt="circle logo" />
            <div
              className="closeBtnStyle"
              id="notificationCloseBtn"
              onClick={() => window.close()}
            >
              {closeIcon}
            </div>
          </div>
        </div>
        <div className="discountBody">
          <div className="bodyContainer">
            <p className="titleGrey" style={{ fontFamily: "MuseoSansRounded" }}>Savings detected!</p>
            <img className="circle-logo" src={iconLogo} alt="circle logo" />
            <p className="textLargeNotification" style={{ fontFamily: "BoldMuseoSansRounded" }}>
              You can get a discount on this website
            </p>
          </div>
          <button
            className="primaryButtonNotification"
            onClick={handleOfferClicked}
            style={{ fontFamily: "MediumMuseoSansRounded" }}
          >
            Discover offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="no-discount-banner-container">
      <div className="discount-header-container">
        <div className="settings-box" onClick={() => setIsSettingsPage(true)}>
          {settingSvg}
        </div>
        <img className="header-img" src={imageLogo} alt="logo" />
        <div className="settings-box" onClick={() => window.close()}>
          {closeIcon}
        </div>
      </div>
      <div className="full-body">
        <div className="no-discount-body">
          <div className="loader-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="lg-text" style={{ fontFamily: "BoldMuseoSansRounded" }}>
            No discounts available on this site
          </p>
          <p className="sub-text">
            We'll alert you if that changes. Savings are just a click away.
          </p>
        </div>
      </div>
    </div>
  );
};

const ExtensionUI = <Popup />;

const styles = `
 ${customFontFaceBold}
 ${customFontFaceMedium}
 ${customFontFaceLight}`;

const styleElement = document.createElement("style");
styleElement.type = "text/css";
styleElement.textContent = styles;
document.head.appendChild(styleElement);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(ExtensionUI);
