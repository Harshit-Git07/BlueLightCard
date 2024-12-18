import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { isActiveOffer } from '@blc-mono/discovery/application/utils/activeOfferRules';
import { isValidAge } from '@blc-mono/discovery/application/utils/ageRestrictionRules';
import { isValidTrust } from '@blc-mono/discovery/application/utils/trustRules';

export const isValidOffer = (offer: Offer, dob: string, organisation: string): boolean => {
  return (
    isValidTrust(organisation, offer.includedTrusts, offer.excludedTrusts) &&
    isValidAge(dob, offer.company.ageRestrictions) &&
    isActiveOffer(offer)
  );
};
