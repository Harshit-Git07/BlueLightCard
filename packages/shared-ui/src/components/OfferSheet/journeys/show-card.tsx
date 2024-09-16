import React from 'react';
import type { Amplitude } from '../../../adapters';
import { DrawerFooter } from '../../Drawer';
import { useRedeemOfferMutation } from '../mutations/redeem-offer-mutation';
import Label from '../../Label';
import MagicButton, { MagicBtnVariant } from '../../MagicButton';
import OfferSheetHeader from '../offer-sheet-header';
import { offerDetailsQuery } from '../queries/offer-details-query';
import { useSuspenseQuery } from '@tanstack/react-query';

type ShowCardJourneyProps = {
  offerId: number;
  companyName: string;
  amplitude: Amplitude | null | undefined;
  onClose: () => void;
};

const ShowCard: React.FC<ShowCardJourneyProps> = ({ offerId, companyName, amplitude, onClose }) => {
  const offer = useSuspenseQuery(offerDetailsQuery(offerId));
  const redeem = useRedeemOfferMutation();

  return (
    <>
      <div className="overflow-y-auto pt-6">
        <OfferSheetHeader offerData={offer.data} companyName={companyName} amplitude={amplitude} />
      </div>

      <DrawerFooter>
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {offer.data.labels.map((label) => (
            <Label key={label} type={'normal'} text={label} className="m-1" />
          ))}
        </div>
        <MagicButton
          className="w-full"
          onClick={() => {
            redeem.mutate({
              offerId: offerId,
              companyName: companyName,
              offerName: offer.data.name,
              companyId: offer.data.companyId,
              amplitude: amplitude,
            });
            // Close drawer
            onClose();
          }}
          variant={MagicBtnVariant.Primary}
          label="Show your Blue Light Card in store"
          data-testid={'_sheet_redeem_button'}
        />
      </DrawerFooter>
    </>
  );
};

export default ShowCard;
