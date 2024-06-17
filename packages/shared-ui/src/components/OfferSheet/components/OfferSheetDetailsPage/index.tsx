import { useCSSMerge, useCSSConditional } from '../../../../hooks/useCSS';
import { PlatformVariant } from '../../../../types';
import { FC } from 'react';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader';
import Label from '../../../Label';
import MagicButton from '../../../MagicButton';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../../store';
import { useLabels } from '../../../../hooks/useLabels';
import { RedemptionPageController } from '../RedemptionPage/RedemptionPageController';
import events from '../../../../utils/amplitude/events';
import { usePlatformAdapter } from '../../../../index';

const OfferSheetDetailsPage: FC = () => {
  const {
    offerDetails: offerData,
    showRedemptionPage,
    offerMeta,
    redemptionType,
    amplitudeEvent,
  } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  const platformAdapter = usePlatformAdapter();

  const labels = useLabels(offerData);

  const dynCss = useCSSConditional({
    'w-full': platformAdapter.platform === PlatformVariant.Web,
  });
  const css = useCSSMerge('', dynCss);

  const getDiscountClickHandler = () => {
    setOfferSheetAtom((prev) => ({ ...prev, showRedemptionPage: true }));

    if (platformAdapter.platform === PlatformVariant.Web && amplitudeEvent) {
      amplitudeEvent({
        event: events.VAULT_CODE_REQUEST_CODE_CLICKED,
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
    }
  };

  if (showRedemptionPage && redemptionType) {
    return (
      <RedemptionPageController
        redemptionType={redemptionType}
        companyName={offerMeta?.companyName || ''}
        offerId={Number(offerData.id)}
        offerName={offerData.name || ''}
      />
    );
  }

  const buttonText = redemptionType === 'generic' ? 'Copy Discount Code' : 'Get Discount';

  return (
    <div className={css}>
      <OfferTopDetailsHeader />
      <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {labels.map((label) => (
            <Label key={label} type="normal" text={label} className="m-1" />
          ))}
        </div>

        <MagicButton
          variant="primary"
          className="w-full"
          transitionDurationMs={200}
          onClick={getDiscountClickHandler}
        >
          <span className="leading-10 font-bold text-md">{buttonText}</span>
        </MagicButton>
      </div>
    </div>
  );
};

export default OfferSheetDetailsPage;
