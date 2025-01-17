import { coerce } from 'zod';

/**
 * Attempts to coerce the input value to a number. If the coercion fails,
 * the original input value is returned.
 *
 * @template T - The type of the input value.
 * @param {T} inital - The value to be coerced to a number.
 * @returns {T | number} - The coerced number if successful, otherwise the original input value.
 */
export function coerceNumber<T>(inital: T): T | number {
  const test = coerce.number().safeParse(inital);

  if (test.error) {
    return inital;
  }

  return test.data;
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
