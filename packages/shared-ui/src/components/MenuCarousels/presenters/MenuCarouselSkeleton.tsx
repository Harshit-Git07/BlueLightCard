import type { FC } from 'react';
import ContentLoader from 'react-content-loader';
import OfferCardCarousel from '../../OfferCardCarousel';

export const MenuCarouselSkeleton: FC = () => {
  return (
    <section>
      <ContentLoader
        speed={3}
        viewBox="0 0 300 10"
        backgroundColor="#f3f3f3"
        foregroundColor="#d1d1d1"
        style={{ width: '100%' }}
      >
        <rect className="h-6 w-full tablet:w-16 tablet:h-2" />
      </ContentLoader>

      <OfferCardCarousel offers={[]} onOfferClick={() => {}} />
    </section>
  );
};
