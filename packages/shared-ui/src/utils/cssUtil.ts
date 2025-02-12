/**
 * Joins array of css classes into a space separated string
 * @deprecated Please use the toClassNames function instead
 * @param classes
 * @returns {String}
 */
export const cssUtil = (classes: string[]): string => {
  return classes.join(' ');
};

export function toClassNames(classes: (string | undefined | null)[]) {
  return classes.filter((_class) => !_class || !!_class.length).join(' ');
}
