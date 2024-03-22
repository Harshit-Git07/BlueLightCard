import React, { useContext } from 'react';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MagicButton from '../../../MagicButton/MagicButton';
import Label from '../../../Label/Label';
import OfferTopDetailsHeader from '../../OfferTopDetailsHeader/OfferTopDetailsHeader';
import AmplitudeContext from '@/context/AmplitudeContext';
import UserContext from '@/context/User/UserContext';
import amplitudeEvents from '@/utils/amplitude/events';
import { RedeemData } from '@/types/api/redemptions';
import { RedemptionPage } from '../RedemptionPage';
import { Logger } from '@/services/Logger';
import { OfferData } from '@/types/api/offers';
import { OfferDetailsErrorPage } from '../../OfferDetailsPage/OfferDetailsErrorPage';

// TODO: Split this out into components for each redemption type
export const GenericVaultOrPreAppliedPage = RedemptionPage((props, hooks) => {
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);

  hooks.useOnRedeemed((redeemData) => {
    amplitude?.setUserId(userCtx.user?.uuid ?? '');
    amplitude?.trackEventAsync(amplitudeEvents.VAULT_CODE_REQUEST_CLICKED, {
      company_id: props.offerMeta.companyId,
      company_name: props.offerMeta.companyName,
      offer_id: props.offerMeta.offerId,
      offer_name: props.offerData.name,
      source: 'sheet',
    });
    const timeout = setTimeout(
      () => redirectToOffer(props.offerData, redeemData as RedeemData),
      1500
    );
    return () => clearTimeout(timeout);
  });

  if (props.state === 'error') {
    return <OfferDetailsErrorPage offer={props.offerMeta} />;
  }

  return (
    <>
      <OfferTopDetailsHeader
        offerMeta={props.offerMeta}
        offerData={props.offerData}
        companyId={props.offerMeta.companyId}
      />

      {/* Bottom section - Button labels etc */}
      <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {props.labels.map((label) => (
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
            variant="secondary"
            className="w-full"
            onClick={() => redirectToOffer(props.offerData, props.redeemData as RedeemData)}
            animate
          >
            <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
              <div className="text-md font-bold text-center flex justify-center gap-2 items-center">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {props.redeemData.redemptionType === 'preApplied'
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

async function redirectToOffer(offerData: OfferData, redeemData: RedeemData) {
  if (!redeemData.redemptionDetails.url) {
    Logger.instance.error('No redemption url found', {
      context: {
        redeemData,
        offerData,
      },
    });
    window.open(`/out.php?lid=${offerData.id}&cid=${offerData.companyId}`, '_blank');
    return;
  }
  if (redeemData.redemptionDetails.code) {
    await navigator.clipboard.writeText(redeemData.redemptionDetails.code);
  }
  const newWindow = window.open(redeemData.redemptionDetails.url, '_blank');
  if (!newWindow || newWindow.closed) {
    window.location.href = redeemData.redemptionDetails.url;
  }
}
