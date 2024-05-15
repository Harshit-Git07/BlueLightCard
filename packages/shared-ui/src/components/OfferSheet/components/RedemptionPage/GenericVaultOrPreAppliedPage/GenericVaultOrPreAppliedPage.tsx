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
import { useEffect } from 'react';
import { sleep } from '../../../../../utils/sleep';

export const GenericVaultOrPreAppliedPage = RedemptionPage((props: Props) => {
  const { offerDetails: offerData, offerMeta, isMobileHybrid } = useAtomValue(offerSheetAtom);
  const labels = useLabels(offerData);
  const platformAdapter = usePlatformAdapter();

  const logCodeView = () => {
    platformAdapter.logAnalyticsEvent(events.VAULT_CODE_USE_CODE_CLICKED, {
      company_id: offerMeta.companyId,
      company_name: offerMeta.companyName,
      offer_id: offerData.id,
      offer_name: offerData.name,
      source: 'sheet',
      origin: isMobileHybrid ? PlatformVariant.MobileHybrid : PlatformVariant.Web,
      design_type: 'modal_popup',
    });
  };

  async function copyCodeAndRedirect(code: string | undefined, url: string | undefined) {
    if (code) {
      await platformAdapter.writeTextToClipboard(code);
    }
    await sleep(1500);
    if (url) {
      platformAdapter.navigateExternal(url);
    }
  }

  async function onSuccess(props: Props) {
    // Ensure that state is success to log since this component mounts multiple times
    if (props.state !== 'success') {
      return;
    }

    const data = props.redeemData.data;

    logCodeView();

    await copyCodeAndRedirect(data?.redemptionDetails?.code, data?.redemptionDetails?.url);
  }

  useEffect(() => {
    onSuccess(props);
  }, [props.state]);

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
                  : 'Code copied!'}
              </div>
              <div className="text-sm text-[#616266] font-medium">
                Redirecting to partner website
              </div>
            </div>
          </MagicButton>
        )}
      </div>
    </>
  );
});
