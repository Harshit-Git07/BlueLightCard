import { MenuMarketplace as SanityMarketplace, MenuOffer as SanityMenuOffer } from '@bluelightcard/sanity-types';
import { v4 } from 'uuid';

export function buildTestSanityMarketplace(menuOffers: SanityMenuOffer[], id?: string): SanityMarketplace {
  return {
    _createdAt: '2024-07-30T09:36:14Z',
    _id: id ?? v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _type: 'menu.marketplace',
    _updatedAt: new Date().toISOString(),
    menus: menuOffers.map((offerMenu) => ({
      offerMenu,
      _key: offerMenu._id,
    })),
  };
}
