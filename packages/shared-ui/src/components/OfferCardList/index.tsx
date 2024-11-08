import { FC } from 'react';
import { ResponsiveOfferCard } from '@bluelightcard/shared-ui';
import getCDNUrl from '../../utils/getCDNUrl';
import { OfferCardListProps } from './types';
import { useCSSMerge, useCSSConditional } from '../../hooks/useCSS';
import OfferCardPlaceholder from './OfferCardPlaceholder';

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
    let placeholderCount = 6;
    if (columns === 1) placeholderCount = 3;
    if (columns === 2) placeholderCount = 4;

    const placeholders = Array.from(Array(placeholderCount).keys());

    return (
      <div className={css}>
        {placeholders.map((placeholder) => (
          <OfferCardPlaceholder
            key={`offer-card-placeholder-${placeholder}`}
            columns={1}
            variant={variant}
          />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return <div>Error loading offers.</div>;
  }

  return (
    <div className={css}>
      {offers.map((offer) => {
        return (
          <div key={offer.offerID}>
            <ResponsiveOfferCard
              id={offer.offerID.toString()}
              type={offer.offerType}
              name={offer.offerName}
              image={
                offer.imageURL !== ''
                  ? offer.imageURL
                  : getCDNUrl(`/companyimages/complarge/retina/${offer.companyID}.jpg`)
              }
              companyId={offer.companyID}
              companyName={offer.companyName}
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
