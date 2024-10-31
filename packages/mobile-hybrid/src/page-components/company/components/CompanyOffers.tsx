import { ResponsiveOfferCard, PlatformVariant, useOfferDetails } from '@bluelightcard/shared-ui';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { companyDataAtom, selectedFilter } from '../atoms';
import { OfferModel, CMSOfferModel } from '../types';
import { useMedia } from 'react-use';

const CompanyOffers: FC = () => {
  const { viewOffer } = useOfferDetails();
  const isMobile = useMedia('(max-width: 500px)');

  const companyData = useAtom(companyDataAtom)[0];
  const offers = companyData?.offers;
  const companyId = companyData?.companyId;
  const companyName = companyData?.companyName;

  const [selectedType] = useAtom(selectedFilter);

  const filteredOffers =
    offers && selectedType === 'All'
      ? offers
      : offers && offers.filter((offer: OfferModel | CMSOfferModel) => offer.type === selectedType);

  const onClickEvent = (offerId: number | string) => {
    if (companyId) {
      try {
        viewOffer({
          offerId: offerId,
          companyId: companyId,
          companyName: companyName || '',
          platform: PlatformVariant.MobileHybrid,
        });
      } catch (e) {
        return;
      }
    }
  };

  return (
    <>
      {filteredOffers &&
        filteredOffers.map((offer: OfferModel | CMSOfferModel, index: number) => {
          return (
            <div key={index} className="pb-2">
              <ResponsiveOfferCard
                id={offer.id}
                name={offer.name}
                image={offer.image}
                type={offer.type}
                platform={PlatformVariant.MobileHybrid}
                companyId={companyId || 0}
                companyName={companyName || ''}
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
