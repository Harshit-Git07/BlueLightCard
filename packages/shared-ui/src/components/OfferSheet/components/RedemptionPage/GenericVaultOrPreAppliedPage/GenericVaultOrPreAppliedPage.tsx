import OfferTopDetailsHeader from '../../OfferTopDetailsHeader';
import { Props, RedemptionPage } from '../RedemptionPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { useAtomValue } from 'jotai';
import OfferDetailsErrorPage from '../../OfferDetailsErrorPage';
import events from '../../../../../utils/amplitude/events';
import { offerSheetAtom } from '../../../store';
import { useLabels } from '../../../../../hooks/useLabels';
import { PlatformVariant } from '../../../../../types';
import {
  isRedeemDataMessage,
  Label,
  MagicButton,
  RedeemResultKind,
  usePlatformAdapter,
} from '../../../../../index';
import { useRef, useEffect } from 'react';
import { RedemptionType } from '../../../types';

export const GenericVaultOrPreAppliedPage = RedemptionPage((props: Props) => {
  const { offerDetails: offerData, offerMeta, amplitudeEvent } = useAtomValue(offerSheetAtom);
  const labels = useLabels(offerData);
  const platformAdapter = usePlatformAdapter();
  const loggedCodeView = useRef(false);
  const loggedVaultRedirect = useRef(false);

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

  useEffect(() => {
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

  async function copyCodeAndRedirect(code: string | undefined, url: string | undefined) {
    // Ensure that state is success to log since this component mounts multiple times
    if (props.state !== 'success') {
      return;
    }

    logCodeClicked();

    if (code) {
      await platformAdapter.writeTextToClipboard(code);
    }
    if (url) {
      // Attempt to open the window in a new tab
      const windowHandle = platformAdapter.navigateExternal(url, { target: 'blank' });

      // If the window failed to open, navigate in the same tab
      if (!windowHandle.isOpen()) {
        platformAdapter.navigateExternal(url, { target: 'self' });
      }

      // Check if the window was closed by an adblocker and fallback to navigating in the same tab
      setTimeout(() => {
        if (!windowHandle.isOpen()) {
          platformAdapter.navigateExternal(url, { target: 'self' });
        }
      }, 50);
    }
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
              if (!isRedeemDataMessage(props.redeemData)) {
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
                {getPrimaryButtonText(props.redemptionType)}
              </div>
              <div className="text-sm text-[#616266] font-medium">
                {getSecondaryButtonText(props.redemptionType)}
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

function getPrimaryButtonText(redemptionType: RedemptionType) {
  switch (redemptionType) {
    case 'preApplied':
      return 'Discount automatically applied';
    default:
      return 'Continue to partner website';
  }
}

function getSecondaryButtonText(redemptionType: RedemptionType) {
  switch (redemptionType) {
    case 'preApplied':
      return 'Go to partner website';
    default:
      return 'Code will be copied - paste it at checkout';
  }
}
