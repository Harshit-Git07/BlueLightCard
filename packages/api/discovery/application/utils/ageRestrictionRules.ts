import { getAgeRestrictions } from '../models/AgeRestrictions';

export const isValidAge = (dob: string, offerAgeRestriction: string): boolean => {
  const validAgeRestrictions = getAgeRestrictions(dob);

  const offerAgeRestrictions = offerAgeRestriction.split(',').map((restriction) => restriction.trim());

  return offerAgeRestrictions.every((restriction) => validAgeRestrictions.includes(restriction.toLowerCase()));
};
