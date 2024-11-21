import React from 'react';
import CollectionCarousel from './CollectionCarousel';

export default function MenuThemedOffer({
  menuThemedOffer,
}: Partial<{
  menuThemedOffer: Sanity.MenuThemedOffer;
}>) {
  if (menuThemedOffer == null) return null;
  return <CollectionCarousel menu={menuThemedOffer} />;
}
