import {
  BoostType as SanityBoostType,
  DiscountType as SanityDiscountType,
  Offer as SanityOffer,
} from '@bluelightcard/sanity-types';

import { mapSanityTrustToTrust } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityTrustToTrust';

import { Boost } from '../../application/models/Boost';
import { Discount } from '../../application/models/Discount';
import { Offer, OfferType } from '../../application/models/Offer';

import { mapSanityCompanyToCompany } from './mapSanityCompanyToCompany';

export const mapSanityOfferToOffer = (sanityOffer: SanityOffer): Offer => {
  if (!sanityOffer.name) {
    throw new Error('Missing sanity field: name');
  }
  if (!sanityOffer.status) {
    throw new Error('Missing sanity field: status');
  }
  if (!sanityOffer.offerType?.offerType) {
    throw new Error('Missing sanity field: offerType');
  }
  if (!sanityOffer.offerDescription) {
    throw new Error('Missing sanity field: offerDescription');
  }
  if (!sanityOffer.offerDescription.content) {
    throw new Error('Missing sanity field: offerDescription.content');
  }
  if (!sanityOffer.company) {
    throw new Error('Missing sanity field: company');
  }

  return {
    id: sanityOffer._id,
    legacyOfferId: sanityOffer.offerId,
    name: sanityOffer.name,
    status: sanityOffer.status,
    offerType: sanityOffer.offerType?.offerType as OfferType,
    offerDescription: getBlockText(sanityOffer.offerDescription.content),
    image: sanityOffer.image?.default?.asset?.url ?? '',
    offerStart: sanityOffer.start,
    offerEnd: sanityOffer.expires,
    evergreen: sanityOffer.evergreen ?? false,
    tags: sanityOffer.tags?.map((tag) => tag._key) ?? [],
    includedTrusts: mapSanityTrustToTrust(sanityOffer.includedTrusts),
    excludedTrusts: mapSanityTrustToTrust(sanityOffer.excludedTrusts),
    company: mapSanityCompanyToCompany(sanityOffer.company),
    categories:
      sanityOffer.categorySelection?.map((category) => ({
        id: category.category1?.id ?? 0,
        name: category.category1?.name ?? '',
        parentCategoryIds: category.category1?.parentCategoryIds ?? [],
        level: category.category1?.level ?? 0,
        updatedAt: category.category1?._updatedAt ?? '',
      })) || [],
    local: sanityOffer.local ?? false,
    discount: sanityOffer.discountDetails ? mapSanityDiscountToDiscount(sanityOffer.discountDetails) : undefined,
    commonExclusions: (sanityOffer.commonExclusions?.commonExclusions?.map((exclusion) => exclusion.name) || []).filter(
      (name): name is string => Boolean(name),
    ),
    boost: sanityOffer.boostDetails ? mapSanityBoostToBoost(sanityOffer.boostDetails) : undefined,
    updatedAt: sanityOffer._updatedAt,
  };
};

const mapSanityDiscountToDiscount = (sanityDiscount: SanityDiscountType): Discount => {
  return {
    type:
      sanityDiscount.discountType === 'other'
        ? sanityDiscount.otherDiscountDetails ?? 'other'
        : sanityDiscount.discountType ?? '',
    description:
      sanityDiscount.discountDescription === 'other'
        ? sanityDiscount.otherDiscountDescriptionDetails ?? 'other'
        : sanityDiscount.discountDescription ?? '',
    coverage:
      sanityDiscount.discountCoverage === 'other'
        ? sanityDiscount.otherDiscountCoverageDetails ?? 'other'
        : sanityDiscount.discountCoverage ?? '',
    updatedAt: new Date().toISOString(),
  };
};

export function getBlockText(
  block?: (
    | {
        children?: {
          text?: string;
          _type?: string;
        }[];
        style?: string;
        _type?: string;
      }
    | { _type: 'image'; _key: string }
    | { _type: 'codeBlock'; _key: string }
  )[],
  lineBreakChar = '↵ ',
) {
  return (
    block?.reduce((accumulatedText, blockItem, index) => {
      if (blockItem._type === 'block' && blockItem.children) {
        const text = blockItem.children.map((child) => child.text ?? '').join('');
        return accumulatedText + text + (index !== block.length - 1 ? lineBreakChar : '');
      }
      return accumulatedText;
    }, '') ?? ''
  );
}

const mapSanityBoostToBoost = (sanityBoost: SanityBoostType): Boost => {
  return {
    type: sanityBoost._type ?? '',
    boosted: sanityBoost.boosted ?? false,
  };
};
