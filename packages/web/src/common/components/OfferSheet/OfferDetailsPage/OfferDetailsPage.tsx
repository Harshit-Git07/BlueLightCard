import { OfferData } from '@/types/api/offers';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader/OfferTopDetailsHeader';
import MagicButton from '@/components/MagicButton/MagicButton';
import Label from '@/components/Label/Label';
import { RedemptionType } from '@/types/api/redemptions';
import { useState } from 'react';
import { useLabels } from '../hooks';
import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { RedemptionPageController } from '../RedemptionPage/RedemptionPageController';

export type Props = {
  offerMeta: OfferMeta;
  offerData: OfferData;
  redemptionType: RedemptionType | 'legacy';
};

export function OfferDetailsPage({ offerMeta, offerData, redemptionType }: Props) {
  const labels = useLabels(offerData);
  const [showRedemptionPage, setShowRedemptionPage] = useState(false);

  if (showRedemptionPage) {
    return (
      <RedemptionPageController
        labels={labels}
        offerMeta={offerMeta}
        offerData={offerData}
        redemptionType={redemptionType}
      />
    );
  }

  return (
    <>
      <OfferTopDetailsHeader
        offerMeta={offerMeta}
        offerData={offerData}
        companyId={offerMeta.companyId}
        showOfferDescription
        showShareFavorite
        showTerms
      />
      {/* Bottom section - Button labels etc */}
      <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {labels.map((label) => (
            <Label key={label} type="normal" text={label} className="m-1" />
          ))}
        </div>

        <MagicButton
          variant="primary"
          className="w-full"
          onClick={() => setShowRedemptionPage(true)}
        >
          <div className="leading-10 font-bold text-md">Get Discount</div>
        </MagicButton>
      </div>
    </>
  );
}
