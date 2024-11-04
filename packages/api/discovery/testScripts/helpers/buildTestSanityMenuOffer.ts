import { MenuOffer as SanityMenuOffer, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { v4 } from 'uuid';

export function buildTestSanityMenuOffer(offers: SanityOffer[], id?: string): SanityMenuOffer {
  return {
    _createdAt: '2024-07-30T09:36:14Z',
    _id: id ?? v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _type: 'menu.offer',
    _updatedAt: new Date().toISOString(),
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    inclusions: offers,
    title: 'Test Menu Offer',
  };
}
