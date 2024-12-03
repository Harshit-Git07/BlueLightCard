import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useMedia } from 'react-use';
import {
  ResponsiveOfferCard,
  PlatformVariant,
  useOfferDetails,
  Heading,
  getCompanyQuery,
  getCompanyOffersQuery,
} from '@bluelightcard/shared-ui';
import { selectedFilter } from '../atoms';
import { useCmsEnabled } from '@/hooks/useCmsEnabled';
import { V2CompaniesGetCompanyOffersResponse } from '@blc/offers-cms/api';

const getFilteredOffers = (offers: V2CompaniesGetCompanyOffersResponse, selectedType: string) => {
  if (selectedType === 'All') {
    return offers;
  }
  return offers.filter((offer) => offer.type === selectedType);
};

const CompanyOffers = ({ companyId }: { companyId: string }) => {
  const { viewOffer } = useOfferDetails();
  const isMobile = useMedia('(max-width: 500px)');

  const cmsEnabled = useCmsEnabled();
  const companyName = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled)).data.name;
  const offers = useSuspenseQuery(getCompanyOffersQuery(companyId, cmsEnabled)).data;

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
      {filteredOffers.map((offer) => {
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
