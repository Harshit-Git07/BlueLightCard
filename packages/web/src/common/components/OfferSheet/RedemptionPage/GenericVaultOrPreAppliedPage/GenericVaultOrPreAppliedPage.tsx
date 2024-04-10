import { useContext } from 'react';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MagicButton from '../../../MagicButton/MagicButton';
import Label from '../../../Label/Label';
import OfferTopDetailsHeader from '../../OfferTopDetailsHeader/OfferTopDetailsHeader';
import AmplitudeContext from '@/context/AmplitudeContext';
import UserContext from '@/context/User/UserContext';
import { RedeemData } from '@/types/api/redemptions';
import { RedemptionPage } from '../RedemptionPage';
import { Logger } from '@/services/Logger';
import { OfferData } from '@/types/api/offers';
import { OfferDetailsErrorPage } from '../../OfferDetailsPage/OfferDetailsErrorPage';
import { logVaultCodeRequestClicked } from '@/root/src/common/utils/amplitude/logVaultCodeRequestClicked';
import { usePathname } from 'next/navigation';
import { logVaultCodeRequestViewed } from '@/root/src/common/utils/amplitude/logVaultCodeRequestViewed';

// TODO: Split this out into components for each redemption type
export const GenericVaultOrPreAppliedPage = RedemptionPage((props, hooks) => {
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);
  const pathname = usePathname();

  const logClick = () => {
    logVaultCodeRequestClicked({
      amplitude,
      userUuid: userCtx.user?.uuid,
      eventSource: 'sheet',
      origin: pathname,
      offerId: props.offerMeta.offerId,
      offerName: props.offerData.name,
      companyId: props.offerMeta.companyId,
      companyName: props.offerMeta.companyName,
    });
  };

  const logCodeView = () => {
    logVaultCodeRequestViewed({
      amplitude,
      userUuid: userCtx.user?.uuid,
      eventSource: 'sheet',
      origin: pathname,
      offerId: props.offerMeta.offerId,
      offerName: props.offerData.name,
      companyId: props.offerMeta.companyId,
      companyName: props.offerMeta.companyName,
    });
  };

  hooks.useOnRedeemed((redeemData) => {
    logClick();
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
            onClick={() => {
              logClick();
              redirectToOffer(props.offerData, props.redeemData as RedeemData);
            }}
            animate
          >
            <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
              <div
                onLoad={() => logCodeView()}
                className="text-md font-bold text-center flex justify-center gap-2 items-center"
              >
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
