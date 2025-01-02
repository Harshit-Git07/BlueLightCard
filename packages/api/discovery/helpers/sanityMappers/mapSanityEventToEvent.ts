import { AgeRestriction, Event as SanityEvent, Venue as SanityVenue } from '@bluelightcard/sanity-types';

import { mapSanityTrustToTrust } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityTrustToTrust';

import { EventOffer, EventStatus, EventType } from '../../application/models/Offer';
import { redemptionTypes } from '../../application/models/Redemption';
import { Venue } from '../../application/models/Venue';

export const mapSanityEventToEventOffer = (sanityOffer: SanityEvent): EventOffer => {
  if (!sanityOffer.name) {
    throw new Error('Missing sanity field: name');
  }
  if (!sanityOffer.status) {
    throw new Error('Missing sanity field: status');
  }
  if (!sanityOffer.eventDescription) {
    throw new Error('Missing sanity field: eventDescription');
  }
  if (!sanityOffer.venue) {
    throw new Error('Missing sanity field: venue');
  }

  if (!sanityOffer.redemptionDetails) {
    throw new Error('Missing sanity field: redemptionDetails');
  }

  if (!redemptionTypes.includes(sanityOffer.redemptionDetails.redemptionType ?? '')) {
    throw new Error('Unknown sanity field: redemptionDetails.redemptionType');
  }

  return {
    offerType: EventType.TICKET,
    id: sanityOffer._id,
    name: sanityOffer.name,
    status: sanityOffer.status as EventStatus,
    eventDescription: getBlockText(sanityOffer.eventDescription),
    image: sanityOffer.image?.default?.asset?.url ?? '',
    offerStart: sanityOffer.eventDate,
    offerEnd: sanityOffer.eventEndDate,
    includedTrusts: mapSanityTrustToTrust(sanityOffer.includedTrust),
    excludedTrusts: mapSanityTrustToTrust(sanityOffer.excludedTrust),
    venue: mapSanityVenueToVenue(sanityOffer.venue),
    categories:
      sanityOffer.categorySelection?.map((category) => ({
        id: category.category1?.id ?? 0,
        name: category.category1?.name ?? '',
        parentCategoryIds: category.category1?.parentCategoryIds ?? [],
        level: category.category1?.level ?? 0,
        updatedAt: category.category1?._updatedAt ?? '',
      })) || [],
    redemption: {
      drawDate: sanityOffer.redemptionDetails.drawDate ?? '',
      numberOfWinners: sanityOffer.redemptionDetails.numberOfWinners ?? 0,
      type: sanityOffer.redemptionDetails.redemptionType!,
    },
    ticketFaceValue: sanityOffer.ticketFaceValue ?? '',
    guestlistCompleteByDate: sanityOffer.guestlistComplete ?? '',
    ageRestrictions: mapAgeRestrictions(sanityOffer?.ageRestrictions ?? []),
    updatedAt: sanityOffer._updatedAt,
  };
};

const mapAgeRestrictions = (ageRestrictions: AgeRestriction[]): string => {
  if (ageRestrictions.length === 0) {
    return 'none';
  }
  return ageRestrictions.map((restriction) => restriction.name).join(', ');
};

const mapSanityVenueToVenue = (sanityVenue: SanityVenue): Venue => {
  return {
    id: sanityVenue._id,
    name: sanityVenue.name ?? '',
    logo: sanityVenue.image?.default?.asset?.url ?? '',
    venueDescription: getBlockText(sanityVenue.venueDescription),
    categories:
      sanityVenue.categorySelection?.map((category) => ({
        id: category.category1?.id ?? 0,
        name: category.category1?.name ?? '',
        parentCategoryIds: category.category1?.parentCategoryIds ?? [],
        level: category.category1?.level ?? 0,
        updatedAt: category.category1?._updatedAt ?? '',
      })) || [],
    updatedAt: sanityVenue._updatedAt,
    addressLine1: sanityVenue.addressLine1 ?? '',
    addressLine2: sanityVenue.addressLine2 ?? '',
    townCity: sanityVenue.townCity ?? '',
    region: sanityVenue.region ?? '',
    postcode: sanityVenue.postcode ?? '',
    telephone: sanityVenue.telephone ?? '',
    location: sanityVenue.location
      ? { latitude: sanityVenue.location.lat ?? 0, longitude: sanityVenue.location.lng ?? 0 }
      : undefined,
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
