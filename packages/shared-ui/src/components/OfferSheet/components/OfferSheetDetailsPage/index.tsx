import { useCSSMerge, useCSSConditional } from '../../../../hooks/useCSS';
import { PlatformVariant } from '../../../../types';
import { FC, useState } from 'react';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader';
import Label from '../../../Label';
import MagicButton from '../../../MagicButton';
import { useAtomValue } from 'jotai';
import { offerSheetAtom } from '../../store';
import { useLabels } from '../../../../hooks/useLabels';
import events from '../../../../utils/amplitude/events';
import { isRedeemDataErrorResponse, usePlatformAdapter } from '../../../../index';
import { useRedeemOffer } from '../../../../hooks/useRedeemOffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { RedemptionType } from '../../types';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';

const OfferSheetDetailsPage: FC = () => {
  const {
    offerDetails: offerData,
    offerMeta,
    redemptionType,
    amplitudeEvent,
  } = useAtomValue(offerSheetAtom);
  const platformAdapter = usePlatformAdapter();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [webRedeemData, setWebRedeemData] = useState<any | null>(null);

  const labels = useLabels(offerData);

  const dynCss = useCSSConditional({
    'w-full': platformAdapter.platform === PlatformVariant.Web,
  });
  const css = useCSSMerge('', dynCss);

  const logCodeClicked = (event: string) => {
    if (!amplitudeEvent) {
      return;
    }
    amplitudeEvent({
      event: event,
      params: {
        company_id: String(offerMeta.companyId),
        company_name: offerMeta.companyName,
        offer_id: String(offerData.id),
        offer_name: offerData.name,
        source: 'sheet',
        origin: platformAdapter.platform,
        design_type: 'modal_popup',
      },
    });
  };

  const getRedemptionData = async () => {
    const result = await platformAdapter.invokeV5Api('/eu/redemptions/member/redeem', {
      method: 'POST',
      body: JSON.stringify({
        offerId: Number(offerData.id),
        companyName: offerMeta?.companyName || '',
        offerName: offerData.name || '',
      }),
    });

    return JSON.parse(result.data);
  };

  // ----- Mobile Hybrid single button click handler
  const hybridDiscountClickHandler = async () => {
    const redeemData = await getRedemptionData();

    if (redeemData.statusCode == 200) {
      switch (redemptionType) {
        case 'generic':
        case 'vault':
        case 'preApplied':
          logCodeClicked(events.VAULT_CODE_USE_CODE_CLICKED);
          if (!isRedeemDataErrorResponse(redeemData.data)) {
            copyCodeAndRedirect(
              redeemData.data.redemptionDetails.code,
              redeemData.data.redemptionDetails.url,
            );
          }
          break;
        // TODO: Implement this page
        case 'showCard':
          return <></>;
        // TODO: Implement this page
        case 'vaultQR':
          return <></>;
        default:
          return <></>;
      }
    } else {
      setShowErrorPage(true);
    }
  };

  async function copyCodeAndRedirect(code: string | undefined, url: string | undefined) {
    // async function for code and redirect on mobile hybrid only
    if (code) {
      await platformAdapter.writeTextToClipboard(code);
    }
    if (url) {
      handleRedirect(url);
    }
  }
  // ----- END of Mobile Hybrid single button click handler

  // Web first button click handler
  const webDiscountClickHandler = async () => {
    const redeemData = await getRedemptionData();
    setWebRedeemData(redeemData);
  };

  // Web second button click handler
  const getDiscountClickHandler = () => {
    if (webRedeemData.statusCode == 200) {
      switch (redemptionType) {
        case 'generic':
        case 'vault':
        case 'preApplied':
          logCodeClicked(events.VAULT_CODE_USE_CODE_CLICKED);
          if (!isRedeemDataErrorResponse(webRedeemData.data)) {
            if (webRedeemData.data.redemptionDetails.code)
              copyCode(webRedeemData.data.redemptionDetails.code);
            if (webRedeemData.data.redemptionDetails.url)
              handleRedirect(webRedeemData.data.redemptionDetails.url);
          }
          break;
        // TODO: Implement this page
        case 'showCard':
          return <></>;
        // TODO: Implement this page
        case 'vaultQR':
          return <></>;
        default:
          return <></>;
      }
    } else {
      setShowErrorPage(true);
    }
  };

  // ---- Separate functions for code and redirect on Web to extract window.open logic from outside an async function ----
  async function copyCode(code: string) {
    await platformAdapter.writeTextToClipboard(code);
  }

  const handleRedirect = (url: string) => {
    const windowHandle = platformAdapter.navigateExternal(url, { target: 'blank' });

    // If the window failed to open, navigate in the same tab
    if (!windowHandle.isOpen()) {
      platformAdapter.navigateExternal(url, { target: 'blank' });
    } else {
      // Check if the window was closed by an adblocker and fallback to navigating in the same tab
      setTimeout(() => {
        if (!windowHandle.isOpen()) {
          platformAdapter.navigateExternal(url, { target: 'self' });
        }
      }, 0);
    }
  };
  // ---- End of separate functions for code and redirect on Web ----

  const buttonText = (redemptionType?: RedemptionType) => {
    let primaryButtonTextValue = '';
    let secondaryButtonTextValue = '';
    let secondaryButtonSubtextValue = '';
    switch (redemptionType) {
      case 'generic':
        primaryButtonTextValue = 'Copy discount code';
        secondaryButtonTextValue = 'Continue to partner website';
        secondaryButtonSubtextValue = 'Code will be copied - paste it at checkout';
        break;
      case 'vault':
        primaryButtonTextValue = 'Copy discount code';
        secondaryButtonTextValue = 'Code copied!';
        secondaryButtonSubtextValue = 'Redirecting to partner website';
        break;
      case 'preApplied':
        primaryButtonTextValue = 'Get discount';
        secondaryButtonTextValue = 'No code needed!';
        secondaryButtonSubtextValue = 'Special pricing applied to on partner website.';
        break;
      // TODO: Implement this page
      case 'showCard':
        primaryButtonTextValue = 'Show your Blue Light Card in store';
        break;
      // TODO: Implement this page
      case 'vaultQR':
        primaryButtonTextValue = 'Get QR code';
        break;
      default:
        primaryButtonTextValue = 'Get discount';
        secondaryButtonTextValue = 'Continue to partner website';
        secondaryButtonSubtextValue = 'Code will be copied - paste it at checkout';
    }

    return {
      primaryText: primaryButtonTextValue,
      secondaryText: secondaryButtonTextValue,
      secondarySubtext: secondaryButtonSubtextValue,
    };
  };

  const primaryButton = (
    <MagicButton
      variant={'primary'}
      className="w-full"
      transitionDurationMs={200}
      onClick={async () => {
        setButtonClicked(true);
        if (platformAdapter.platform === PlatformVariant.Web)
          logCodeClicked(events.VAULT_CODE_REQUEST_CODE_CLICKED);
        if (platformAdapter.platform === PlatformVariant.MobileHybrid) hybridDiscountClickHandler();
        if (platformAdapter.platform === PlatformVariant.Web) webDiscountClickHandler();
      }}
    >
      <span className="leading-10 font-bold text-md">{buttonText(redemptionType).primaryText}</span>
    </MagicButton>
  );

  const secondaryButton = (
    <MagicButton variant="secondary" className="w-full" animate>
      <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
        <div className="text-md font-bold text-center flex justify-center gap-2 items-center">
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          {buttonText(redemptionType).secondaryText}
        </div>
        <div className="text-sm text-[#616266] font-medium">
          {buttonText(redemptionType).secondarySubtext}
        </div>
      </div>
    </MagicButton>
  );

  const webSecondaryButton = (
    <MagicButton
      onClick={() => {
        getDiscountClickHandler();
      }}
      variant="secondary"
      className="w-full"
      animate
    >
      <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
        <div className="text-md font-bold text-center flex justify-center gap-2 items-center">
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          {getWebSecondaryButtonText()}
        </div>
        <div className="text-sm text-[#616266] font-medium">{getWebSecondaryButtonSubText()}</div>
      </div>
    </MagicButton>
  );

  function getWebSecondaryButtonText() {
    switch (redemptionType) {
      case 'preApplied':
        return 'Discount automatically applied';
      default:
        return 'Continue to partner website';
    }
  }

  function getWebSecondaryButtonSubText() {
    switch (redemptionType) {
      case 'preApplied':
        return 'Go to partner website';
      default:
        return 'Code will be copied - paste it at checkout';
    }
  }

  const renderButton = () => {
    if (buttonClicked && platformAdapter.platform === PlatformVariant.MobileHybrid) {
      return secondaryButton;
    } else if (buttonClicked && platformAdapter.platform === PlatformVariant.Web) {
      return webSecondaryButton;
    }
    return primaryButton;
  };
  return (
    <div className={css}>
      {showErrorPage && <OfferDetailsErrorPage />}
      {!showErrorPage && (
        <>
          <OfferTopDetailsHeader />
          <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
            <div className="w-full flex flex-wrap mb-2 justify-center">
              {labels.map((label) => (
                <Label key={label} type="normal" text={label} className="m-1" />
              ))}
            </div>
            {renderButton()}
          </div>
        </>
      )}
    </div>
  );
};

export default OfferSheetDetailsPage;
