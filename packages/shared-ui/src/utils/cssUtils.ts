import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Joins array of css classes into a space separated string
 * @param classes
 * @returns {String}
 */
export const cssUtil = (...inputs: ClassValue[]): string => {
  return mergeClassnames(...inputs);
};

export function mergeClassnames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
