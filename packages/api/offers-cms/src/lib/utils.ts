import type { Offer, Trust } from '@bluelightcard/sanity-types';
import { coerce } from 'zod';

/**
 * Attempts to coerce the input value to a number. If the coercion fails,
 * the original input value is returned.
 *
 * @template T - The type of the input value.
 * @param {T} initial - The value to be coerced to a number.
 * @returns {T | number} - The coerced number if successful, otherwise the original input value.
 */
export function coerceNumber<T>(initial: T): T | number {
  const test = coerce.number().safeParse(initial);

  if (test.error) {
    return initial;
  }

  return test.data;
}

/**
 * Determines if a trust is eligible based on inclusion and exclusion lists
 *
 * @param {Trust[] | undefined} includedTrusts - List of trusts that are explicitly included
 * @param {Trust[] | undefined} excludedTrusts - List of trusts that are explicitly excluded
 * @param {string} trustCode - The trust code to check eligibility for
 * @returns {boolean} - True if the trust is eligible, false otherwise
 *
 * @description
 * The eligibility is determined by the following rules:
 * 1. If the trust is in the excluded list, it is not eligible
 * 2. If there is no included list, the trust is eligible (unless excluded)
 * 3. If there is an included list, the trust must be explicitly included
 */
export function trustIsEligible(
  includedTrusts: Trust[] | undefined,
  excludedTrusts: Trust[] | undefined,
  trustCode: string,
): boolean {
  // Check if excluded first
  if (excludedTrusts?.some((t) => t.code === trustCode)) {
    return false;
  }

  // If no inclusions specified, trust is eligible (as long as not excluded)
  if (!includedTrusts || includedTrusts.length === 0) {
    return true;
  }

  // Must be explicitly included
  return includedTrusts.some((t) => t.code === trustCode);
}

/**
 * Checks if an offer is currently valid and available
 *
 * @param {Offer} offer - The offer to validate
 * @returns {boolean} - True if the offer is valid and available, false otherwise
 *
 * @description
 * An offer is considered valid if:
 * 1. It has a 'live' status
 * 2. Its start date (if specified) has passed
 * 3. Its expiration date (if specified) has not passed
 */
export function isValidOffer(offer: Offer) {
  if (offer.status !== 'live') {
    return false;
  }

  const now = new Date();

  if (offer.start && new Date(offer.start) > now) {
    return false;
  }

  if (offer.expires && new Date(offer.expires) < now) {
    return false;
  }

  return true;
}
