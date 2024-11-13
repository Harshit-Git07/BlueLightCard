import {
  ResponsiveOfferCard,
  PlatformVariant,
  useOfferDetails,
  Heading,
} from '@bluelightcard/shared-ui';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { companyDataAtom, selectedFilter } from '../atoms';
import { OfferModel, CMSOfferModel } from '../types';
import { useMedia } from 'react-use';

const getFilteredOffers = (
  offers: (OfferModel | CMSOfferModel)[] | undefined,
  selectedType: string,
) => {
  if (!offers) {
    return [];
  }
  if (selectedType === 'All') {
    return offers;
  }
  return offers.filter((offer: OfferModel | CMSOfferModel) => offer.type === selectedType);
};

const CompanyOffers: FC = () => {
  const { viewOffer } = useOfferDetails();
  const isMobile = useMedia('(max-width: 500px)');

  const companyData = useAtom(companyDataAtom)[0];
  const offers = companyData?.offers;
  const companyId = companyData?.companyId;
  const companyName = companyData?.companyName;

  const [selectedType] = useAtom(selectedFilter);

  const filteredOffers = getFilteredOffers(offers, selectedType);

  const onClickEvent = async (offerId: number | string) => {
    if (companyId) {
      try {
        await viewOffer({
          offerId: offerId,
          companyId: companyId,
          companyName: companyName ?? '',
          platform: PlatformVariant.MobileHybrid,
        });
      } catch (e) {
        return;
      }
    }
  };

  if (filteredOffers?.length === 0) {
    return (
      <div className="mb-0 desktop:mb-[71px]">
        <Heading headingLevel="h1">No offers have been found.</Heading>
      </div>
    );
  }

  return (
    <>
      {filteredOffers.map((offer: OfferModel | CMSOfferModel) => {
        return (
          <div key={offer.id} className="pb-2">
            <ResponsiveOfferCard
              id={offer.id.toString()}
              name={offer.name}
              image={offer.image}
              type={offer.type}
              platform={PlatformVariant.MobileHybrid}
              companyId={(companyId ?? '').toString()}
              companyName={companyName ?? ''}
              variant={isMobile ? 'horizontal' : 'vertical'}
              onClick={() => onClickEvent(offer.id)}
            />
          </div>
        );
      })}
    </>
  );
};

export default CompanyOffers;
