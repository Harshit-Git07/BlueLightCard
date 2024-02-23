const domainList = require("./domains.json");
interface Domain {
  id: string;
  name: string;
  url: string;
}

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.message === "CheckDomains") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs.length) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      const activeTab = tabs[0];
      const url = activeTab.url;

      const domainName = url
        ? url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0]
        : "";
      const domainArray: Domain[] = domainList;

      const domainIncluded = domainArray.find(
        (domainObject) => domainObject.url === domainName
      );

      if (domainIncluded) {
        sendResponse({
          ...domainIncluded,
        });
      }
    });
  }

  if (request.message === "RetrieveSettings") {
    chrome.storage.local.get("isStatisticsEnabled", (data) => {
      if (data) {
        sendResponse({
          isStatisticsEnabled: data["isStatisticsEnabled"],
        });
      }
    });
  }

  if (request.message === "TriggerStatistics") {
    chrome.storage.local.get("isStatisticsEnabled", (data) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error retrieving isStatisticsEnabled from storage:",
          chrome.runtime.lastError
        );
        return;
      }

      if (data) {
        const value = !data["isStatisticsEnabled"];
        chrome.storage.local.set({
          isStatisticsEnabled: value,
        });
        sendResponse({ isEnabled: value });
      }
    });
  }

  if (request.message === "notificationViewed") {
    chrome.storage.local.set({
      notificationViewedId: request.id,
    });
  }

  if (request.message === "offerReceivedViewed") {
    chrome.storage.local.set({
      offerReceivedViewedId: request.id,
    });
  }

  if (request.message === "scanUrls") {
    const urls = request.urls;
    const domainArray: Domain[] = domainList;

    const matchedUrls: { url: string; idx: number }[] = [];

    urls.map((url: string, idx: number) => {
      const hasDiscount = domainArray.find((item) => item.url === url);
      if (hasDiscount) {
        matchedUrls.push({ url: url, idx: idx });
      }
    });
    sendResponse({ matchedUrls: matchedUrls });
  }

  return true;
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.type === "main_frame") {
      const url = new URL(details.url);

      if (
        url.hostname === "www.bluelightcard.co.uk" &&
        url.pathname === "/out.php"
      ) {
        const params = new URLSearchParams(url.search);
        const cid = params.get("cid");

        if (cid) {
          chrome.storage.local.set({ lastCid: cid });
        }
      }
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id !== tabId) {
        return;
      }
      const url = new URL(String(tab.url));
      const domainName = url.hostname
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0];

      const domainArray: Domain[] = domainList;

      const domainIncluded = domainArray.find(
        (domainObject) => domainObject.url === domainName
      );

      if (domainIncluded) {
        chrome.storage.local.get(
          ["isNotificationViewed", "notificationViewedId"],
          (data) => {
            console.log("is notification viewed", data);
          }
        );

        chrome.storage.local.get(
          ["offerReceivedViewedId", "notificationViewedId", "lastCid"],
          (data) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error retrieving CID from storage:",
                chrome.runtime.lastError
              );
              return;
            }

            if (
              data["lastCid"] === domainIncluded.id &&
              domainName !== "bluelightcard.co.uk"
            ) {
              chrome.runtime.sendMessage({
                isDiscountReceived: true,
                ...domainIncluded,
              });

              if (domainIncluded.id === data["offerReceivedViewedId"]) {
                return;
              }
              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  chrome.tabs.sendMessage(Number(tabs[0].id), {
                    isDiscountReceived: true,
                    ...domainIncluded,
                  });
                }
              );
            } else {
              chrome.runtime.sendMessage({
                isDiscountReceived: false,
                ...domainIncluded,
              });

              if (domainIncluded.id === data["notificationViewedId"]) {
                return;
              }

              chrome.tabs.sendMessage(Number(tabs[0].id), {
                isDiscountReceived: false,
                ...domainIncluded,
              });
            }
          }
        );
      }
    });
  }
});
