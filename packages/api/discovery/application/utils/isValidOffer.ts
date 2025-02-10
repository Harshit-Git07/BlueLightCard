import { EventOffer, Offer } from '@blc-mono/discovery/application/models/Offer';
import { isActiveEventOffer, isActiveOffer } from '@blc-mono/discovery/application/utils/activeOfferRules';
import { isValidAge } from '@blc-mono/discovery/application/utils/ageRestrictionRules';
import { isValidTrust } from '@blc-mono/discovery/application/utils/trustRules';

import { MenuEventOffer, MenuOffer } from '../models/Menu';

export const isValidOffer = (offer: Offer | MenuOffer, dob: string, organisation: string): boolean => {
  return (
    isValidTrust(organisation, offer.includedTrusts, offer.excludedTrusts) &&
    isValidAge(dob, offer.company.ageRestrictions) &&
    isActiveOffer(offer)
  );
};

export const isValidEvent = (event: EventOffer | MenuEventOffer, dob: string, organisation: string): boolean => {
  return (
    isValidTrust(organisation, event.includedTrusts, event.excludedTrusts) &&
    isValidAge(dob, event.ageRestrictions) &&
    isActiveEventOffer(event)
  );
};
