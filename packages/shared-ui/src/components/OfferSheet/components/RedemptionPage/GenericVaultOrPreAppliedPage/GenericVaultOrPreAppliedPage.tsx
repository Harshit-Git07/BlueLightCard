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
import { Label, MagicButton, usePlatformAdapter } from '../../../../../index';
import { useRef } from 'react';

export const GenericVaultOrPreAppliedPage = RedemptionPage((props: Props) => {
  const {
    offerDetails: offerData,
    offerMeta,
    isMobileHybrid,
    amplitudeEvent,
  } = useAtomValue(offerSheetAtom);
  const labels = useLabels(offerData);
  const platformAdapter = usePlatformAdapter();
  const loggedCodeView = useRef(false);

  const logCodeClicked = () => {
    if (!amplitudeEvent) {
      return;
    }

    // Prevent duplicate logs if the user clicks the button multiple times
    if (loggedCodeView.current) {
      return;
    }

    amplitudeEvent({
      event: events.VAULT_CODE_USE_CODE_CLICKED,
      params: {
        company_id: offerMeta.companyId,
        company_name: offerMeta.companyName,
        offer_id: offerData.id,
        offer_name: offerData.name,
        source: 'sheet',
        origin: isMobileHybrid ? PlatformVariant.MobileHybrid : PlatformVariant.Web,
        design_type: 'modal_popup',
      },
    });
  };

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

  if (props.state === 'error') {
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
            onClick={() =>
              copyCodeAndRedirect(
                props.redeemData.data?.redemptionDetails?.code,
                props.redeemData.data?.redemptionDetails?.url,
              )
            }
            variant="secondary"
            className="w-full"
            animate
          >
            <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
              <div className="text-md font-bold text-center flex justify-center gap-2 items-center">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {props.redemptionType === 'preApplied'
                  ? 'Discount automatically applied'
                  : 'Copy code!'}
              </div>
              <div className="text-sm text-[#616266] font-medium">Go to partner website</div>
            </div>
          </MagicButton>
        )}
      </div>
    </>
  );
});
