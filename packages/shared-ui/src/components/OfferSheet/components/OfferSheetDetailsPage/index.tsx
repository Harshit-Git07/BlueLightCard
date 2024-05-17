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

const OfferSheetDetailsPage: FC = () => {
  const {
    offerDetails: offerData,
    showRedemptionPage,
    offerMeta,
    redemptionType,
    platform,
  } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);

  const labels = useLabels(offerData);

  const dynCss = useCSSConditional({
    'w-full': platform === PlatformVariant.Web,
  });
  const css = useCSSMerge('', dynCss);

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
          onClick={() => setOfferSheetAtom((prev) => ({ ...prev, showRedemptionPage: true }))}
        >
          <span className="leading-10 font-bold text-md">Get Discount</span>
        </MagicButton>
      </div>
    </div>
  );
};

export default OfferSheetDetailsPage;
