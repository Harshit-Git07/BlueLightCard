import { useCSSMerge, useCSSConditional } from '../../../../hooks/useCSS';
import { PlatformVariant } from '../../../../types';
import { type FC, useState } from 'react';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader';
import Label from '../../../Label';
import MagicButton, { MagicBtnVariant } from '../../../MagicButton';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../../store';
import { useLabels } from '../../../../hooks/useLabels';
import events from '../../../../utils/amplitude/events';
import {
  isRedeemDataErrorResponse,
  usePlatformAdapter,
  RedeemResultKind,
  offerTypeParser,
} from '../../../../index';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import type { RedemptionType } from '../../types';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';
import { z } from 'zod';
import { queryOptions, useQuery } from '@tanstack/react-query';

const profileModel = z.object({
  firstname: z.string(),
  surname: z.string(),
  organisation: z.string(),
  dob: z.string(),
  gender: z.string(),
  mobile: z.string(),
  emailValidated: z.number(),
  spareEmail: z.string(),
  spareEmailValidated: z.number(),
  twoFactorAuthentication: z.boolean(),
});

const cardModel = z.object({
  cardId: z.coerce.number(),
  expires: z.string(),
  cardStatus: z.string(),
  datePosted: z.string().nullable(),
});

const userResponseModel = z.object({
  profile: profileModel,
  cards: z.array(cardModel),
});

const VALID_CARD_STATUSES = ['ADDED_TO_BATCH', 'USER_BATCHED', 'PHYSICAL_CARD'];
const GRACE_PERIOD_DAYS = 30;

function getIsRedemptionButtonDisabled() {
  const platformAdapter = usePlatformAdapter();

  return queryOptions({
    queryKey: ['userStatus'],
    queryFn: async () => {
      const result = await platformAdapter.invokeV5Api('/eu/identity/user', {
        method: 'GET',
      });

      const data = userResponseModel.parse(JSON.parse(result.data).data);

      return data;
    },
    select: (data) => {
      if (data.cards.length === 0) {
        return true;
      }

      const latestCard = data.cards.reduce((max, card) => (max.cardId > card.cardId ? max : card));

      if (VALID_CARD_STATUSES.includes(latestCard.cardStatus)) {
        return false;
      }

      if (latestCard.cardStatus === 'CARD_EXPIRED') {
        const expirationDate = new Date(Number(latestCard.expires));
        expirationDate.setDate(expirationDate.getDate() + GRACE_PERIOD_DAYS);

        if (new Date() <= expirationDate) {
          return false;
        }
        return true;
      }
      return true;
    },
    staleTime: Infinity,
  });
}

const OfferSheetDetailsPage: FC = () => {
  const {
    offerDetails: offerData,
    offerMeta,
    redemptionType,
    amplitudeEvent,
    onClose,
  } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  const platformAdapter = usePlatformAdapter();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [webRedeemData, setWebRedeemData] = useState<any | null>(null);
  const [maxPerUserReached, setMaxPerUserReached] = useState(false);
  const isRedemptionButtonDisabled = useQuery(getIsRedemptionButtonDisabled());

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
        company_name: String(offerMeta.companyName),
        offer_id: String(offerData.id),
        offer_name: String(offerData.name),
        source: 'sheet',
        origin: platformAdapter.platform,
        design_type: 'modal_popup',
        redemption_type: redemptionType,
      },
    });
  };

  const handleMaxPerUserReached = () => {
    setMaxPerUserReached(true);
    setTimeout(() => {
      logCodeClicked(events.VAULT_CODE_REDIRECT_TO_VAULT);
      platformAdapter.navigate('/vaultcodes.php');
    }, 3000);
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
          logCodeClicked(events.USE_CODE_CLICKED);
          if (!isRedeemDataErrorResponse(redeemData.data)) {
            copyCodeAndRedirect(
              redeemData.data.redemptionDetails.code,
              redeemData.data.redemptionDetails.url,
            );
          }
          break;
        case 'vault':
          logCodeClicked(events.VAULT_CODE_USE_CODE_CLICKED);
          if (!isRedeemDataErrorResponse(redeemData.data)) {
            copyCodeAndRedirect(
              redeemData.data.redemptionDetails.code,
              redeemData.data.redemptionDetails.url,
            );
          }
          break;
        case 'preApplied':
          logCodeClicked(events.REQUEST_CODE_CLICKED);
          if (!isRedeemDataErrorResponse(redeemData.data)) {
            handleRedirect(redeemData.data.redemptionDetails.url);
          }
          break;
        case 'showCard':
          logCodeClicked(events.REQUEST_CODE_CLICKED);
          platformAdapter.navigate('/highstreetcard.php');
          break;
        case 'vaultQR':
          logCodeClicked(events.REQUEST_CODE_CLICKED);
          setOfferSheetAtom((v) => ({
            ...v,
            qrCodeValue: redeemData.data.redemptionDetails.code,
          }));

          break;
        default:
          return <></>;
      }
    } else if (redeemData?.data?.kind === RedeemResultKind.MaxPerUserReached) {
      handleMaxPerUserReached();
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

    if (redeemData.statusCode == 200) {
      setWebRedeemData(redeemData);

      if (redemptionType === 'vaultQR') {
        setOfferSheetAtom((v) => ({
          ...v,
          qrCodeValue: redeemData.data.redemptionDetails.code,
        }));
      } else if (redemptionType === 'showCard') {
        onClose();
      }
    } else if (redeemData?.data?.kind === RedeemResultKind.MaxPerUserReached) {
      handleMaxPerUserReached();
    } else {
      setShowErrorPage(true);
    }
  };

  // Web second button click handler
  const getDiscountClickHandler = () => {
    if (
      redemptionType === 'generic' ||
      redemptionType === 'vault' ||
      redemptionType === 'preApplied'
    ) {
      if (webRedeemData.statusCode !== 200) {
        setShowErrorPage(true);
        return;
      }

      if (redemptionType === 'vault') {
        logCodeClicked(events.VAULT_CODE_USE_CODE_CLICKED);
      } else {
        logCodeClicked(events.USE_CODE_CLICKED);
      }

      if (!isRedeemDataErrorResponse(webRedeemData.data)) {
        if (redemptionType !== 'preApplied' && webRedeemData.data.redemptionDetails.code)
          copyCode(webRedeemData.data.redemptionDetails.code);
        if (webRedeemData.data.redemptionDetails.url)
          handleRedirect(webRedeemData.data.redemptionDetails.url);
      }
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

  const primaryButtonText = (redemptionType?: RedemptionType) => {
    // ****
    //  Sets the text for the primary button that is displayed when we open the offer sheet, based on the redemption type
    // ****
    let primaryButtonTextValue = '';

    switch (redemptionType) {
      case 'generic':
        primaryButtonTextValue = 'Copy discount code';
        break;
      case 'vault':
        primaryButtonTextValue = 'Copy discount code';
        break;
      case 'preApplied':
        if (offerData.type === offerTypeParser.Giftcards.type) {
          primaryButtonTextValue = 'Get voucher';
        } else {
          primaryButtonTextValue = 'Get discount';
        }
        break;
      case 'showCard':
        primaryButtonTextValue = 'Show your Blue Light Card in store';
        break;
      case 'vaultQR':
        primaryButtonTextValue = 'Get QR code';
        break;
      default:
        primaryButtonTextValue = 'Get discount';
    }

    return primaryButtonTextValue;
  };

  const mobileHybridButtonText = (redemptionType?: RedemptionType) => {
    // ****
    //  Sets the text for the magic button that is displayed on mobile hybrid, based on the redemption type
    // ****
    let secondaryButtonTextValue = '';
    let secondaryButtonSubtextValue = '';

    switch (redemptionType) {
      case 'generic':
        secondaryButtonTextValue = 'Code copied!';
        secondaryButtonSubtextValue = 'Redirecting to partner website';
        break;
      case 'vault':
        secondaryButtonTextValue = 'Code copied!';
        secondaryButtonSubtextValue = 'Redirecting to partner website';
        break;
      case 'preApplied':
        // TODO ADD if statement for giftcards offer type that are pre-applied redemption type
        if (offerData.type === offerTypeParser.Giftcards.type) {
          secondaryButtonTextValue = 'Get instant savings';
          secondaryButtonSubtextValue = 'Redirecting to voucher shop';
        } else {
          secondaryButtonTextValue = 'No code needed!';
          secondaryButtonSubtextValue = 'Special pricing applied on partner site';
        }
        break;
      case 'showCard':
        break;
      case 'vaultQR':
        secondaryButtonTextValue = 'QR code ready';
        secondaryButtonSubtextValue = 'Show the above code to get discount';
        break;
      default:
        secondaryButtonTextValue = 'Continue to partner website';
        secondaryButtonSubtextValue = 'Code will be copied - paste it at checkout';
    }

    return {
      secondaryText: secondaryButtonTextValue,
      secondarySubtext: secondaryButtonSubtextValue,
    };
  };

  const webSecondaryButtonText = (redemptionType?: RedemptionType) => {
    // ****
    //  Sets the text for the magic button that is displayed on web, based on the redemption type
    // ****
    let webSecondaryButtonTextValue = '';
    let webSecondaryButtonSubtextValue = '';

    switch (redemptionType) {
      case 'preApplied':
        if (offerData.type === offerTypeParser.Giftcards.type) {
          webSecondaryButtonTextValue = 'Continue to voucher shop';
          webSecondaryButtonSubtextValue = 'Get instant savings';
        } else {
          webSecondaryButtonTextValue = 'Continue to partner website';
          webSecondaryButtonSubtextValue = 'Special pricing applied automatically';
        }
        break;
      case 'vaultQR':
        webSecondaryButtonTextValue = 'QR code ready';
        webSecondaryButtonSubtextValue = 'Show the above code to get discount';
        break;
      default:
        webSecondaryButtonTextValue = 'Continue to partner website';
        webSecondaryButtonSubtextValue = 'Code will be copied - paste it at checkout';
    }

    return {
      webSecondaryText: webSecondaryButtonTextValue,
      webSecondarySubtext: webSecondaryButtonSubtextValue,
    };
  };

  const primaryButton = (
    <MagicButton
      variant={isRedemptionButtonDisabled.data ? MagicBtnVariant.Disabled : MagicBtnVariant.Primary}
      className="w-full"
      onClick={async () => {
        if (platformAdapter.platform === PlatformVariant.MobileHybrid) {
          await hybridDiscountClickHandler();
        } else if (platformAdapter.platform === PlatformVariant.Web) {
          switch (redemptionType) {
            case 'vault':
              logCodeClicked(events.VAULT_CODE_REQUEST_CODE_CLICKED);
              break;
            case 'generic':
            case 'preApplied':
            case 'vaultQR':
            case 'showCard':
              logCodeClicked(events.REQUEST_CODE_CLICKED);
              break;
            default:
              break;
          }
          await webDiscountClickHandler();
        }
        // For showCard redemption type, there is no magic button displayed after the click
        if (redemptionType !== 'showCard') setButtonClicked(true);
      }}
      label={primaryButtonText(redemptionType)}
    />
  );

  const maxPerUserReachedSecondaryButton = (
    <MagicButton
      variant={MagicBtnVariant.Pressed}
      className="w-full"
      icon={faWandMagicSparkles}
      label="Taking you to the vault"
      description="You have reached the code limit for this offer"
    />
  );

  const mobileHybridSecondaryButton = (
    <MagicButton
      variant={MagicBtnVariant.Pressed}
      className="w-full"
      icon={faWandMagicSparkles}
      label={mobileHybridButtonText(redemptionType).secondaryText}
      description={mobileHybridButtonText(redemptionType).secondarySubtext}
    />
  );

  const webSecondaryButton = (
    <MagicButton
      onClick={() => {
        getDiscountClickHandler();
      }}
      variant={MagicBtnVariant.Pressed}
      className="w-full"
      icon={faWandMagicSparkles}
      label={webSecondaryButtonText(redemptionType)?.webSecondaryText}
      description={webSecondaryButtonText(redemptionType)?.webSecondarySubtext}
    />
  );

  const renderButton = () => {
    if (buttonClicked) {
      if (maxPerUserReached) return maxPerUserReachedSecondaryButton;
      if (platformAdapter.platform === PlatformVariant.MobileHybrid)
        return mobileHybridSecondaryButton;
      if (platformAdapter.platform === PlatformVariant.Web) return webSecondaryButton;
    }
    return (
      <div>
        {primaryButton}
        {isRedemptionButtonDisabled.data && (
          <center>
            <span className="text-colour-onSurface-subtle font-body-light text-body-light font-body-light-weight leading-body-light tracking-body-light">
              This offer is for active card holders only. Please check the status of your account.
            </span>
          </center>
        )}
      </div>
    );
  };

  return (
    <div className={css}>
      {showErrorPage && <OfferDetailsErrorPage />}
      {!showErrorPage && (
        <>
          <OfferTopDetailsHeader />
          <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-colour-surface-light dark:bg-colour-surface-dark">
            <div className="w-full flex flex-wrap mb-2 justify-center">
              {labels.map((label) => (
                <Label
                  key={label}
                  type="normal"
                  text={label === offerTypeParser.Giftcards.type ? 'Voucher' : label}
                  className="m-1"
                />
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
