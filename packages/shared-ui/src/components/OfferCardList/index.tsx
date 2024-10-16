import { FC } from 'react';
import { ResponsiveOfferCard } from '@bluelightcard/shared-ui';
import getCDNUrl from '../../utils/getCDNUrl';
import { OfferCardListProps } from './types';
import { useCSSMerge, useCSSConditional } from '../../hooks/useCSS';
import OfferCardPlaceholder from './OfferCardPlaceholder';
import { faker } from '@faker-js/faker';

export const getOfferTypeFromIndex = (tagIndex: number) => {
  switch (tagIndex) {
    case 0:
      return 'Online';
    case 2:
      return 'Giftcards';
    case 5:
    case 6:
      return 'In-store';
    default:
      return 'Online';
  }
};

const OfferCardList: FC<OfferCardListProps> = ({
  status,
  onOfferClick,
  offers,
  columns = 3,
  variant = 'vertical',
}) => {
  const dynCss: string = useCSSConditional({
    'grid-cols-3 gap-x-6 gap-y-14': columns === 3 && variant === 'vertical',
    'grid-cols-2 gap-x-6 gap-y-14': columns === 2 && variant === 'vertical',
    'grid-cols-1 gap-y-6': columns === 1 && variant === 'vertical',
    'grid-cols-1': columns === 1 && variant === 'horizontal',
  });
  const css = useCSSMerge('grid', dynCss);

  if (status === 'loading') {
    switch (columns) {
      case 1:
        return [...Array(3)].map((_) => (
          <OfferCardPlaceholder key={faker.string.uuid()} columns={1} variant={'vertical'} />
        ));
      case 2:
        return [...Array(4)].map((_) => (
          <OfferCardPlaceholder key={faker.string.uuid()} columns={2} variant={'vertical'} />
        ));
      default:
        return [...Array(6)].map((_) => (
          <OfferCardPlaceholder key={faker.string.uuid()} columns={3} variant={'vertical'} />
        ));
    }
  }

  if (status === 'error') {
    return <div>Error loading offers.</div>;
  }

  return (
    <div className={css}>
      {offers.map((offer) => {
        return (
          <div key={offer.id}>
            <ResponsiveOfferCard
              id={offer.id}
              type={getOfferTypeFromIndex(offer.OfferType)}
              name={offer.OfferName}
              image={
                offer.imageSrc !== ''
                  ? offer.imageSrc
                  : getCDNUrl(`/companyimages/complarge/retina/${offer.CompID}.jpg`)
              }
              companyId={offer.CompID}
              companyName={offer.CompanyName}
              onClick={() => onOfferClick(offer)}
              variant={variant}
            />
          </div>
        );
      })}
    </div>
  );
};

export default OfferCardList;
