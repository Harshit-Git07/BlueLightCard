import Button from '@/components/Button/Button';
import Heading from '@/components/Heading/Heading';
import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { useLogOfferView } from '@/hooks/useLogOfferView';

export type Props = {
  offer: OfferMeta;
};

export function OfferDetailsErrorPage({ offer }: Props) {
  const logOfferView = useLogOfferView();

  return (
    <div className="text-palette-primary text-center mx-4 space-y-4">
      <Heading headingLevel={'h2'} className=" text-black">
        Error loading offer
      </Heading>
      <p className="text-base">You can still get to your offer by clicking the button below.</p>
      <Button
        type="link"
        href={`/offerdetails.php?cid=${offer.companyId}&oid=${offer.offerId}`}
        onClick={() =>
          logOfferView('page', {
            offerId: offer.offerId,
            companyId: offer.companyId,
            companyName: offer.companyName,
          })
        }
      >
        {offer.companyName}
      </Button>
    </div>
  );
}
