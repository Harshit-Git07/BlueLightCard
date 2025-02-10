import { MenuOffer as SanityMenuOffer, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { addMonths, subMonths } from 'date-fns';
import { v4 } from 'uuid';

type InclusionOffer = {
  offer: SanityOffer;
  start?: string;
  end?: string;
  _key: string;
};

export function buildTestSanityMenuOffer(offers: InclusionOffer[], id?: string): SanityMenuOffer {
  return {
    _createdAt: '2024-07-30T09:36:14Z',
    _id: id ?? v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _type: 'menu.offer',
    _updatedAt: new Date().toISOString(),
    start: subMonths(new Date(), 1).toISOString(),
    end: addMonths(new Date(), 1).toISOString(),
    inclusions: offers,
    title: 'Test Menu Offer',
  };
}
