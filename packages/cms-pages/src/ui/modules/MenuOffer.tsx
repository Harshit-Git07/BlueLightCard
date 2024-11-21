import React from 'react';
import OffersCarousel from './OfferCarousel';

export default function MenuOffer({
  menuOffer,
}: Partial<{
  menuOffer: Sanity.MenuOffer;
}>) {
  if (menuOffer == null) return null;
  return <OffersCarousel menu={menuOffer} />;
}
