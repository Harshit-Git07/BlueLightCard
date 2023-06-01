/**
 * Decides which value in the multi dimensional array should be returned based on the @condition in each sub array
 * @example [@condition, value]
 * @param conditions
 * @returns T
 */
export const decider = <T>(conditions: [boolean | undefined, T][]): T | undefined => {
  return conditions.find((condition) => !!condition[0])?.[1];
};
