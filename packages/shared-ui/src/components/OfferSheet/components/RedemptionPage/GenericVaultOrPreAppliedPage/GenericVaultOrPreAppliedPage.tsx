import OfferTopDetailsHeader from '../../OfferTopDetailsHeader';
import { Props, RedemptionPage } from '../RedemptionPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { useAtomValue } from 'jotai';
import events from '../../../../../utils/amplitude/events';
import { offerSheetAtom } from '../../../store';
import { useLabels } from '../../../../../hooks/useLabels';
import {
  isRedeemDataErrorResponse,
  Label,
  MagicButton,
  RedeemResultKind,
  usePlatformAdapter,
  PlatformVariant,
} from '../../../../../index';
import { useEffect, useRef } from 'react';
import { RedemptionType } from '../../../types';
import OfferDetailsErrorPage from '../../OfferDetailsErrorPage';

export const GenericVaultOrPreAppliedPage = RedemptionPage((props: Props) => {
  const { offerDetails: offerData, offerMeta, amplitudeEvent } = useAtomValue(offerSheetAtom);
  const labels = useLabels(offerData);
  const platformAdapter = usePlatformAdapter();
  const loggedCodeView = useRef(false);
  const loggedVaultRedirect = useRef(false);

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
      }, 50);
    }
  };

  const logCodeClicked = () => {
    if (!amplitudeEvent) {
      return;
    }

    // Prevent duplicate logs if the user clicks the button multiple times
    if (loggedCodeView.current) {
      return;
    }

    loggedCodeView.current = true;
    amplitudeEvent({
      event: events.VAULT_CODE_USE_CODE_CLICKED,
      params: {
        company_id: offerMeta.companyId,
        company_name: offerMeta.companyName,
        offer_id: offerData.id,
        offer_name: offerData.name,
        source: 'sheet',
        origin: platformAdapter.platform,
        design_type: 'modal_popup',
      },
    });
  };

  async function copyCodeAndRedirect(code: string | undefined, url: string | undefined) {
    if (props.state !== 'success') {
      return;
    }
    logCodeClicked();

    if (code) {
      await platformAdapter.writeTextToClipboard(code);
    }
    if (url) {
      handleRedirect(url);
    }
  }

  useEffect(() => {
    if (props.state === 'success' && platformAdapter.platform === PlatformVariant.MobileHybrid) {
      if (loggedCodeView.current) {
        return;
      }
      logCodeClicked();
      setTimeout(() => {
        if (!isRedeemDataErrorResponse(props.redeemData)) {
          copyCodeAndRedirect(
            props.redeemData.redemptionDetails.code,
            props.redeemData?.redemptionDetails.url,
          );
        }
      }, 1000);
    }

    if (props.errorState === RedeemResultKind.MaxPerUserReached) {
      /**
       * Redirect to the vault after 3 seconds if the user has reached the code limit
       */
      setTimeout(() => {
        if (!amplitudeEvent) {
          return;
        }

        // Prevent duplicate logs if the user clicks the button multiple times
        if (loggedVaultRedirect.current) {
          return;
        }

        amplitudeEvent({
          event: events.VAULT_CODE_REDIRECT_TO_VAULT,
          params: {
            company_id: offerMeta.companyId,
            company_name: offerMeta.companyName,
            offer_id: offerData.id,
            offer_name: offerData.name,
            source: 'sheet',
            origin: platformAdapter.platform,
            design_type: 'modal_popup',
          },
        });
        loggedVaultRedirect.current = true;
        platformAdapter.navigate('/vaultcodes.php');
      }, 3000);
    }
  }, [props.state, props.errorState]);

  if (props.state === 'error' && props.errorState !== RedeemResultKind.MaxPerUserReached) {
    return <OfferDetailsErrorPage />;
  }

  return (
    <>
      <OfferTopDetailsHeader
        showExclusions={props.showExclusions}
        showOfferDescription={props.showOfferDescription}
        showShareFavorite={props.showOfferDescription}
        showTerms={props.showOfferDescription}
      />
      {/* Bottom section - Button labels etc */}
      <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {labels.map((label) => (
            <Label key={label} type={'normal'} text={label} className="m-1" />
          ))}
        </div>

        {props.state === 'loading' && (
          <MagicButton clickable={false} animate variant="primary" className="w-full">
            <div className="leading-10 font-bold text-md">Loading...</div>
          </MagicButton>
        )}

        {props.state === 'success' && (
          <MagicButton
            onClick={() => {
              if (
                !isRedeemDataErrorResponse(props.redeemData) &&
                platformAdapter.platform === PlatformVariant.Web
              ) {
                copyCodeAndRedirect(
                  props.redeemData?.redemptionDetails?.code,
                  props.redeemData?.redemptionDetails?.url,
                );
              }
            }}
            variant="secondary"
            className="w-full"
            animate
          >
            <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
              <div className="text-md font-bold text-center flex justify-center gap-2 items-center">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {getPrimaryButtonText(props.redemptionType, platformAdapter.platform)}
              </div>
              <div className="text-sm text-[#616266] font-medium">
                {getSecondaryButtonText(props.redemptionType, platformAdapter.platform)}
              </div>
            </div>
          </MagicButton>
        )}

        {props.errorState === RedeemResultKind.MaxPerUserReached && (
          <MagicButton variant="secondary" className="w-full" animate>
            <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
              <div className="text-md font-bold text-center flex justify-center gap-2 items-center">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                Taking you to the vault
              </div>
              <div className="text-sm text-[#616266] font-medium">
                You have reached the code limit for this offer
              </div>
            </div>
          </MagicButton>
        )}
      </div>
    </>
  );
});

function getPrimaryButtonText(redemptionType: RedemptionType, currentPlatform: PlatformVariant) {
  switch (redemptionType) {
    case 'preApplied':
      return 'Discount automatically applied';
    default:
      return currentPlatform === PlatformVariant.Web
        ? 'Continue to partner website'
        : 'Code copied!';
  }
}

function getSecondaryButtonText(redemptionType: RedemptionType, currentPlatform: PlatformVariant) {
  switch (redemptionType) {
    case 'preApplied':
      return 'Go to partner website';
    default:
      return currentPlatform === PlatformVariant.Web
        ? 'Code will be copied - paste it at checkout'
        : 'Redirecting to partner website';
  }
}
