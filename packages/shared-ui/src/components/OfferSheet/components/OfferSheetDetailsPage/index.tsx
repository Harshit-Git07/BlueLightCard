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
  offerTypeLabelMap,
  Typography,
  getBrandedRedemptionsPath,
  RedeemData,
} from '../../../../index';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import type { RedemptionType } from '../../types';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';
import { useQuery } from '@tanstack/react-query';
import { userQuery } from '../../../../api/identity';

// mobile-hybrid component imported for Conversion BLC 4.0 Interstitial experiment
import OfferInterstitial from '../../../OfferInterstitial/OfferInterstitial';

import moment from 'moment';

enum BallotRedeemError {
  ALREADY_ENTERED = 'ballot_already_entered',
  UNAUTHORISED = 'ballot_unauthorised',
  EXPIRED = 'ballot_expired',
}

type RedeemDataT = {
  statusCode: number;
  data: RedeemData & {
    kind?: any;
  };
};

const OfferSheetDetailsPage: FC = () => {
  const {
    offerDetails: offerData,
    eventDetails: eventData,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ballotRedeemError, setBallotRedeemError] = useState<BallotRedeemError | null>(null);

  const flag = (feature: string) => platformAdapter.getAmplitudeFeatureFlag(feature);

  const user = useQuery(userQuery());
  const offer = redemptionType === 'ballot' ? eventData : offerData;

  const labels = useLabels(offer);
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
        offer_id: String(offer.id),
        offer_name: String(offer.name),
        source: 'sheet',
        origin: platformAdapter.platform,
        design_type: 'modal_popup',
        redemption_type: redemptionType,
      },
    });
  };

  const getRedemptionData = async () => {
    const result = await platformAdapter.invokeV5Api(
      `${getBrandedRedemptionsPath()}/member/redeem`,
      {
        method: 'POST',
        body: JSON.stringify({
          offerId: offer.id,
          companyName: offerMeta?.companyName || '',
          offerName: offer.name || '',
        }),
      },
    );

    return JSON.parse(result.data);
  };

  const handleBallotError = (statusCode: number) => {
    setButtonClicked(false);
    if (statusCode === 409) {
      setBallotRedeemError(BallotRedeemError.ALREADY_ENTERED);
    } else if (statusCode === 403) {
      setBallotRedeemError(BallotRedeemError.UNAUTHORISED);
    } else if (statusCode === 404) {
      setBallotRedeemError(BallotRedeemError.EXPIRED);
    } else {
      setShowErrorPage(true);
    }
  };

  // ----- Mobile Hybrid single button click handler
  const hybridDiscountClickHandler = async () => {
    const redeemData: RedeemDataT = await getRedemptionData();

    const handleGenericRedemption = (redeemData: RedeemDataT) => {
      logCodeClicked(events.USE_CODE_CLICKED);
      if (!isRedeemDataErrorResponse(redeemData.data)) {
        copyCodeAndRedirect(
          redeemData.data.redemptionDetails.code,
          redeemData.data.redemptionDetails.url,
        );
      }
    };

    const handleVaultRedemption = (redeemData: RedeemDataT) => {
      logCodeClicked(events.VAULT_CODE_USE_CODE_CLICKED);
      if (!isRedeemDataErrorResponse(redeemData.data)) {
        copyCodeAndRedirect(
          redeemData.data.redemptionDetails.code,
          redeemData.data.redemptionDetails.url,
        );
      }
    };

    const handlePreAppliedAndCompareRedemptions = (redeemData: RedeemDataT) => {
      logCodeClicked(events.REQUEST_CODE_CLICKED);
      if (!isRedeemDataErrorResponse(redeemData.data)) {
        handleRedirect(redeemData.data.redemptionDetails.url as string);
      }
    };

    const handleShowCardRedemption = () => {
      logCodeClicked(events.REQUEST_CODE_CLICKED);
      platformAdapter.navigate('/highstreetcard.php');
    };

    const handleVaultQRRedemption = (redeemData: RedeemDataT) => {
      logCodeClicked(events.REQUEST_CODE_CLICKED);
      if (!isRedeemDataErrorResponse(redeemData.data)) {
        setOfferSheetAtom((v) => {
          if (!isRedeemDataErrorResponse(redeemData.data)) {
            return {
              ...v,
              qrCodeValue: redeemData.data.redemptionDetails.code,
            };
          } else {
            return {
              ...v,
              qrCodeValue: '',
            };
          }
        });
      }
    };

    const handleBallotRedemption = () => {
      logCodeClicked(events.REQUEST_CODE_CLICKED);
    };

    if (redeemData.statusCode == 200) {
      switch (redemptionType) {
        case 'generic':
          handleGenericRedemption(redeemData);
          break;
        case 'vault':
          handleVaultRedemption(redeemData);
          break;
        case 'preApplied':
        case 'compare':
          handlePreAppliedAndCompareRedemptions(redeemData);
          break;
        case 'showCard':
          handleShowCardRedemption();
          break;
        case 'vaultQR':
          handleVaultQRRedemption(redeemData);
          break;
        case 'ballot':
          handleBallotRedemption();
          break;
        default:
          return <></>;
      }
    } else if (redeemData?.data?.kind === RedeemResultKind.MaxPerUserReached) {
      setMaxPerUserReached(true);
    } else if (redemptionType === 'ballot') {
      handleBallotError(redeemData.statusCode);
    } else {
      setShowErrorPage(true);
    }
  };

  async function copyCodeAndRedirect(code: string | undefined, url: string | undefined) {
    if (code) {
      await platformAdapter.writeTextToClipboard(code);
    }

    setIsModalOpen(true);

    if (url) {
      setTimeout(() => {
        handleRedirect(url);

        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
      }, 3000);
    }
  }
  // ----- END of Mobile Hybrid single button click handler

  // Web first button click handler
  const webDiscountClickHandler = async () => {
    const redeemData: RedeemDataT = await getRedemptionData();

    if (redeemData.statusCode == 200) {
      setWebRedeemData(redeemData);

      if (redemptionType === 'vaultQR') {
        setOfferSheetAtom((v) => {
          if (!isRedeemDataErrorResponse(redeemData.data)) {
            return {
              ...v,
              qrCodeValue: redeemData.data.redemptionDetails.code,
            };
          } else {
            return {
              ...v,
              qrCodeValue: '',
            };
          }
        });
      } else if (redemptionType === 'showCard') {
        onClose();
      }
    } else if (redeemData?.data?.kind === RedeemResultKind.MaxPerUserReached) {
      setMaxPerUserReached(true);
    } else if (redemptionType === 'ballot') {
      handleBallotError(redeemData.statusCode);
    } else {
      setShowErrorPage(true);
    }
  };

  // Web second button click handler
  const getDiscountClickHandler = () => {
    if (
      redemptionType === 'generic' ||
      redemptionType === 'vault' ||
      redemptionType === 'preApplied' ||
      redemptionType === 'compare'
    ) {
      if (webRedeemData.statusCode !== 200) {
        setShowErrorPage(true);
        return;
      }

      logCodeClicked(
        redemptionType === 'vault' ? events.VAULT_CODE_USE_CODE_CLICKED : events.USE_CODE_CLICKED,
      );

      if (!isRedeemDataErrorResponse(webRedeemData.data)) {
        if (
          redemptionType !== 'preApplied' &&
          redemptionType !== 'compare' &&
          webRedeemData.data.redemptionDetails.code
        )
          copyCode(webRedeemData.data.redemptionDetails.code);
        if (webRedeemData.data.redemptionDetails.url)
          handleRedirect(webRedeemData.data.redemptionDetails.url);
      }
    } else if (redemptionType === 'ballot') {
      logCodeClicked(events.USE_CODE_CLICKED);
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
        if (offerData.type === 'gift-card') {
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
      case 'ballot':
        primaryButtonTextValue = 'Enter ballot';
        break;
      case 'compare':
        primaryButtonTextValue = 'Compare';
        break;
      default:
        primaryButtonTextValue = 'Get discount';
    }

    return primaryButtonTextValue;
  };

  const hasDealExpired = (expiry?: string | null) => {
    if (flag('conv-blc-8-0-deals-timer') && flag('conv-blc-8-0-deals-timer') !== 'treatment') {
      return false;
    }

    const currentDate = moment();
    const expiryDate = moment(expiry);
    const timeDiff = expiryDate.diff(currentDate);

    return timeDiff < 0;
  };

  const mobileHybridButtonText = (redemptionType?: RedemptionType) => {
    // ****
    //  Sets the text for the magic button that is displayed on mobile hybrid, based on the redemption type
    // ****
    let secondaryButtonTextValue = '';
    let secondaryButtonSubtextValue = '';

    switch (redemptionType) {
      case 'generic':
      case 'vault':
        secondaryButtonTextValue = 'Code copied!';
        secondaryButtonSubtextValue = 'Redirecting to partner website';
        break;
      case 'preApplied':
        // if statement for gift-card offer type that are pre-applied redemption type
        if (offerData.type === 'gift-card') {
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
      case 'ballot':
        secondaryButtonTextValue = 'Entry received';
        secondaryButtonSubtextValue = 'We’ll let you know if you’ve won via email';
        break;
      case 'compare':
        secondaryButtonTextValue = 'Compare';
        secondaryButtonSubtextValue = 'Redirecting to comparison service';
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
        if (offerData.type === 'gift-card') {
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
      case 'ballot':
        webSecondaryButtonTextValue = 'Entry received';
        webSecondaryButtonSubtextValue = 'We’ll let you know if you’ve won via email';
        break;
      case 'compare':
        webSecondaryButtonTextValue = 'Continue to comparison service';
        // compare will not have a webSecondaryButtonSubtextValue as it is not needed
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
      variant={
        user.data?.canRedeemOffer && !hasDealExpired(offer.expires) && !ballotRedeemError
          ? MagicBtnVariant.Primary
          : MagicBtnVariant.Disabled
      }
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
            case 'ballot':
            case 'showCard':
            case 'compare':
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
      label={hasDealExpired(offerData.expires) ? 'Deal expired' : primaryButtonText(redemptionType)}
    />
  );

  const maxPerUserReachedSecondaryButton = (
    <MagicButton
      variant={MagicBtnVariant.Disabled}
      className="w-full"
      label={primaryButtonText(redemptionType)}
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
    if (buttonClicked && !ballotRedeemError) {
      if (maxPerUserReached) return maxPerUserReachedSecondaryButton;
      if (platformAdapter.platform === PlatformVariant.MobileHybrid)
        return mobileHybridSecondaryButton;
      if (platformAdapter.platform === PlatformVariant.Web) return webSecondaryButton;
    }

    return (
      <div>
        {primaryButton}
        {!user.data?.canRedeemOffer ? (
          <center>
            <span className="text-colour-onSurface-subtle font-body-light text-body-light font-body-light-weight leading-body-light tracking-body-light">
              This offer is for active card holders only. Please check the status of your account.
            </span>
          </center>
        ) : (
          <>
            {ballotRedeemError === BallotRedeemError.UNAUTHORISED && (
              <center>
                <span className="text-colour-onSurface-subtle font-body-light text-body-light font-body-light-weight leading-body-light tracking-body-light">
                  This competition is for active card holders only. Please check the status of your
                  account.
                </span>
              </center>
            )}
            {ballotRedeemError === BallotRedeemError.EXPIRED && (
              <center>
                <span className="text-colour-onSurface-subtle font-body-light text-body-light font-body-light-weight leading-body-light tracking-body-light">
                  Entry date to this competition has expired
                </span>
              </center>
            )}
            {ballotRedeemError === BallotRedeemError.ALREADY_ENTERED && (
              <center>
                <span className="text-colour-onSurface-subtle font-body-light text-body-light font-body-light-weight leading-body-light tracking-body-light">
                  It looks like you’ve already entered this ballot! We’ll let you know if you’ve won
                  via email.
                </span>
              </center>
            )}
          </>
        )}
      </div>
    );
  };

  const mappedLabels = labels.map((label) => {
    if (label === 'gift-card') {
      return 'Voucher';
    }
    if (label in offerTypeLabelMap) {
      return offerTypeLabelMap[label as keyof typeof offerTypeLabelMap];
    }
    return label;
  });

  return (
    <div className={css}>
      {flag('conv-blc-4-0-interstitial') && (
        <OfferInterstitial
          isOpen={isModalOpen}
          imageSource={offer.image}
          companyName={offerMeta.companyName ?? 'company'}
          offerName={offer.name}
        />
      )}
      {showErrorPage && <OfferDetailsErrorPage />}
      {!showErrorPage && user.data && (
        <>
          <OfferTopDetailsHeader />
          <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-colour-surface-light dark:bg-colour-surface-dark">
            <div className="w-full flex flex-wrap mb-2 justify-center">
              {mappedLabels.map((label) => (
                <Label key={label} type="normal" text={label} className="m-1" />
              ))}
            </div>
            {renderButton()}
            {maxPerUserReached && (
              <div className="mt-2 text-center">
                <Typography
                  variant="body-light"
                  className="!text-colour-onSurface-subtle !dark:text-colour-onSurface-subtle-dark"
                >
                  You have reached the code limit for this offer.
                </Typography>
                <Typography
                  variant="body-light"
                  className="!text-colour-onSurface-subtle !dark:text-colour-onSurface-subtle-dark"
                >
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Check your emails we've sent you earlier to redeem this offer.
                </Typography>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OfferSheetDetailsPage;
