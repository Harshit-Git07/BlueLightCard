import {
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

export function buildTestSanityMenuOffer(
  offers: InclusionOffer[],
  id?: string,
  start?: string,
  end?: string,
): SanityMenuOffer {
  return {
    _createdAt: '2024-07-30T09:36:14Z',
    _id: id ?? v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _type: 'menu.offer',
    _updatedAt: new Date().toISOString(),
    start: start ?? subMonths(new Date(), 1).toISOString(),
    end: end ?? addMonths(new Date(), 1).toISOString(),
    inclusions: offers,
    title: 'Test Menu Offer',
  };
}
