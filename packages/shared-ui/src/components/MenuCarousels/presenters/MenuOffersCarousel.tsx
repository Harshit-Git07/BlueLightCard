import type { FC } from 'react';
import type { MenuOffersCarouselPresenterProps } from '../types';
import OfferCardCarousel from '../../OfferCardCarousel';
import Typography from '../../Typography';

export const MenuOffersCarousel: FC<MenuOffersCarouselPresenterProps> = ({
  title,
  offers,
  onOfferClick = () => {},
}) => (
  <section>
    <Typography className="mb-6" variant="headline-bold">
      {title}
    </Typography>

    <OfferCardCarousel offers={offers ?? []} onOfferClick={onOfferClick} />
  </section>
);
