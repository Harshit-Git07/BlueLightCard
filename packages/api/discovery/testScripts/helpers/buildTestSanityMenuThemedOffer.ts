import {
  MenuThemedOffer,
  MenuThemedOffer as SanityMenuThemedOffer,
  MenuWaysToSave as SanityMenuWaysToSave,
  Offer as SanityOffer,
} from '@bluelightcard/sanity-types';
import { v4 } from 'uuid';

const themedMenuOfferValues = (offers: SanityOffer[], id?: string, subMenuId?: string): MenuThemedOffer => {
  return {
    _createdAt: '2024-07-30T09:36:14Z',
    _id: id ?? v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _updatedAt: new Date().toISOString(),
    _type: 'menu.themed.offer',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    inclusions: [
      {
        _type: 'collection',
        _key: subMenuId ?? `collection-${v4()}`,
        collectionDescription: 'Test Collection Description',
        collectionName: 'Test Collection Name',
        contents: offers.map((offer) => ({
          _type: 'offerReference',
          _key: `offerReference-${v4()}`,
          reference: offer,
        })),
      },
    ],
    title: 'Test Menu Themed Offer',
  };
};

export function buildTestSanityMenuThemedOffer(
  offers: SanityOffer[],
  id?: string,
  subMenuId?: string,
): SanityMenuThemedOffer {
  return {
    ...themedMenuOfferValues(offers, id, subMenuId),
    _type: 'menu.themed.offer',
  };
}

export function buildTestSanityWaysToSaveMenu(
  offers: SanityOffer[],
  id?: string,
  subMenuId?: string,
): SanityMenuWaysToSave {
  return {
    ...themedMenuOfferValues(offers, id, subMenuId),
    _type: 'menu.waysToSave',
  };
}
