import { LegacyOffers } from '../models/legacy/legacyOffers';
import { OFFER_TYPES } from './global-constants';
import { CompanyOffer } from '../models/companyOffers';

export function getOfferDetail(offer: LegacyOffers): CompanyOffer {
  const offerType = OFFER_TYPES[offer.typeid as keyof typeof OFFER_TYPES];
  const expiry = offer.expires && !isNaN(new Date(offer.expires).valueOf()) ? new Date(offer.expires) : undefined;
  const offerWithOutExpiry = {
    id: offer.id,
    name: offer.name,
    description: offer.desc,
    type: offerType,
    terms: offer.terms,
  };
  const offerRes = expiry ? { ...offerWithOutExpiry, expiry } : offerWithOutExpiry;
  return offerRes;
}
