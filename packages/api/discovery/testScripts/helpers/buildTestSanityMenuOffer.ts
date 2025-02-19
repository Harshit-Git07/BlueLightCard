import {
  MenuDealsOfTheWeek as SanityMenuDealsOfTheWeek,
  MenuFeaturedOffers as SanityMenuFeaturedOffers,
  MenuOffer as SanityMenuOffer,
  Offer as SanityOffer,
  SanityImageAsset,
  SanityImageCrop,
  SanityImageHotspot,
} from '@bluelightcard/sanity-types';
import { addMonths, subMonths } from 'date-fns';
import { v4 } from 'uuid';

type InclusionOffer = {
  offer: SanityOffer;
  start?: string;
  end?: string;
  _key: string;
  overrides?: {
    title?: string;
    description?: string;
    image?: {
      default?: {
        asset?: SanityImageAsset;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: 'image';
      };
      light?: {
        asset?: SanityImageAsset;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: 'image';
      };
      dark?: {
        asset?: SanityImageAsset;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: 'image';
      };
    };
  };
};

const menuOfferValues = (offers: InclusionOffer[], id?: string, start?: string, end?: string) => {
  return {
    _createdAt: '2024-07-30T09:36:14Z',
    _id: id ?? v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _updatedAt: new Date().toISOString(),
    start: start ?? subMonths(new Date(), 1).toISOString(),
    end: end ?? addMonths(new Date(), 1).toISOString(),
    inclusions: offers,
    title: 'Test Menu Offer',
  };
};

export function buildTestSanityFeaturedMenuOffer(
  offers: InclusionOffer[],
  id?: string,
  start?: string,
  end?: string,
): SanityMenuFeaturedOffers {
  return {
    ...menuOfferValues(offers, id, start, end),
    _type: 'menu.featuredOffers',
  };
}

export function buildTestSanityMenuOffer(
  offers: InclusionOffer[],
  id?: string,
  start?: string,
  end?: string,
): SanityMenuOffer {
  return {
    ...menuOfferValues(offers, id, start, end),
    _type: 'menu.offer',
  };
}

export function buildTestSanityDOTWMenuOffer(
  offers: InclusionOffer[],
  id?: string,
  start?: string,
  end?: string,
): SanityMenuDealsOfTheWeek {
  return {
    ...menuOfferValues(offers, id, start, end),
    _type: 'menu.dealsOfTheWeek',
  };
}
