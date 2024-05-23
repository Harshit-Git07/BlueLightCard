import { Variants } from '@amplitude/experiment-js-client';

/**
 * Converts an object with variants from amplitude client to an object with the same keys but the values are the experiment variant
 * e.g. { experiment1: 'control', experiment2: 'treatment' }
 * @param originalObject original object with variants from amplitude client
 * @returns an object with the same keys but the values are the experiment variant
 */
export function transformObjVariants(originalObject: Variants): Record<string, string> {
  const newObject: Record<string, string> = {};

  for (const key in originalObject) {
    newObject[key] = originalObject[key].value ?? 'control';
  }

  return newObject;
}
