import { EventOffer, Offer } from '@blc-mono/discovery/application/models/Offer';

export type OpenSearchBulkCommand = OpenSearchCommand | OpenSearchBody;

export type OpenSearchCommand = {
  create: object;
};

type CompanyLocation = {
  geo_point: { lat: number; lon: number };
  location_id: string;
  store_name?: string;
};

export type OpenSearchBody = {
  offer_id: string;
  legacy_offer_id?: number;
  offer_name: string;
  offer_status: string;
  offer_type: string;
  offer_description: string;
  offer_description_stripped: string;
  offer_image: string;
  offer_expires?: string;
  offer_start?: string;
  offer_tags: string[];
  company_id: string;
  legacy_company_id?: number;
  company_locations: CompanyLocation[];
  company_name: string;
  company_name_stripped: string;
  company_small_logo: string;
  company_tags: string[];
  age_restrictions: string;
  included_trusts: string[];
  excluded_trusts: string[];
  category_name: string;
  category_id: number;
  date_offer_last_updated: string;
  venue_id?: string;
  venue_name?: string;
};

export const mapOfferToOpenSearchBody = (offer: Offer): OpenSearchBody => ({
  offer_id: offer.id,
  legacy_offer_id: offer.legacyOfferId,
  offer_name: offer.name.trim(),
  offer_status: offer.status,
  offer_type: offer.offerType,
  offer_description: offer.offerDescription.trim(),
  offer_description_stripped: offer.offerDescription.trim().replace(/<[^<>]*>/g, ''),
  offer_image: offer.image.trim(),
  offer_expires: offer.offerEnd,
  offer_start: offer.offerStart,
  offer_tags: offer.tags,
  company_id: offer.company.id,
  company_locations: offer.company.locations.map((location) => ({
    location_id: location.id,
    geo_point: location.location,
    store_name: location.storeName,
  })),
  legacy_company_id: offer.company.legacyCompanyId,
  company_name: offer.company.name,
  company_name_stripped: offer.company.name.trim() || '',
  company_small_logo: offer.company.logo,
  company_tags: offer.company.alsoKnownAs,
  age_restrictions: offer.company.ageRestrictions || 'none',
  included_trusts: offer.includedTrusts,
  excluded_trusts: offer.excludedTrusts,
  category_name: offer.categories.length > 0 ? offer.categories[0].name : '',
  category_id: offer.categories.length > 0 ? offer.categories[0].id : 0,
  date_offer_last_updated: offer.updatedAt,
});

export const mapEventToOpenSearchBody = (event: EventOffer): OpenSearchBody => ({
  offer_id: event.id,
  offer_name: event.name.trim(),
  offer_status: event.status,
  offer_type: event.offerType,
  offer_description: event.eventDescription.trim(),
  offer_description_stripped: event.eventDescription.trim().replace(/<[^<>]*>/g, ''),
  offer_image: event.image.trim(),
  offer_expires: event.guestlistCompleteByDate,
  offer_start: event.offerStart,
  offer_tags: [],
  company_id: '',
  company_name: '',
  company_locations: [],
  company_name_stripped: '',
  company_small_logo: '',
  company_tags: [],
  age_restrictions: event.ageRestrictions,
  included_trusts: event.includedTrusts,
  excluded_trusts: event.excludedTrusts,
  category_name: event.categories.length > 0 ? event.categories[0].name : '',
  category_id: event.categories.length > 0 ? event.categories[0].id : 0,
  date_offer_last_updated: event.updatedAt,
  venue_id: event.venue.id,
  venue_name: event.venue.name,
});
