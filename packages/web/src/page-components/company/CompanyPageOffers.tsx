import {
  getCompanyOffersQuery,
  getCompanyQuery,
  Heading,
  ResponsiveOfferCard,
} from '@bluelightcard/shared-ui/index';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCmsEnabled } from '../../common/hooks/useCmsEnabled';

type Props = {
  isMobile: boolean;
  companyId: string | null;
  filter: string | null;
  onOfferClick: (offerId: string, companyId: string, companyName: string) => void;
};

const CompanyPageOffers = ({ companyId, onOfferClick, filter, isMobile }: Props) => {
  const cmsEnabled = useCmsEnabled();

  const offers = useSuspenseQuery({
    ...getCompanyOffersQuery(companyId, cmsEnabled),
    select: (data) => data.filter((i) => filter === null || i.type === filter),
  });
  const company = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled));

  if (offers.data.length === 0) {
    return (
      <div className="mb-0 desktop:mb-[71px]">
        <Heading headingLevel="h1">No offers have been found.</Heading>
      </div>
    );
  }

  return (
    <div className="mb-0 desktop:mb-[71px]">
      <div
        className={`flex flex-col ${
          isMobile ? 'gap-2' : 'gap-10'
        } tablet:gap-10 desktop:grid desktop:grid-cols-2`}
      >
        {offers.data.map((offer) => {
          return (
            <button
              className="text-left"
              key={offer.id}
              onClick={() => onOfferClick(offer.id, company.data.id, company.data.name)}
            >
              <ResponsiveOfferCard
                id={offer.id}
                type={offer.type}
                name={offer.name}
                image={offer.image}
                companyId={company.data.id}
                companyName={company.data.name}
                variant={isMobile ? 'horizontal' : 'vertical'}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyPageOffers;
