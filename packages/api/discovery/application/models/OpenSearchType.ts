import { Offer } from '@blc-mono/discovery/application/models/Offer';

export type OpenSearchBulkCommand = OpenSearchCommand | OpenSearchBody;

export type OpenSearchCommand = {
  create: object;
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
  legacy_company_id: offer.company.legacyCompanyId,
  company_name: offer.company.name,
  company_name_stripped: offer.company.name.trim() || '',
  company_small_logo: offer.company.logo,
  company_tags: offer.company.alsoKnownAs,
  age_restrictions: offer.company.ageRestrictions || 'none',
  included_trusts: offer.company.includedTrusts,
  excluded_trusts: offer.company.excludedTrusts,
  category_name: offer.categories.length > 0 ? offer.categories[0].name : '',
  category_id: offer.categories.length > 0 ? offer.categories[0].id : 0,
  date_offer_last_updated: offer.updatedAt,
});
