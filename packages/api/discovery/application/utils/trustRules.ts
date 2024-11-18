export const isValidTrust = (trust: string, includedTrusts: string[], excludedTrusts: string[]): boolean => {
  if (includedTrusts.includes(trust)) {
    return true;
  }
  if (includedTrusts.length > 0 && !includedTrusts.includes(trust)) {
    return false;
  }
  if (!excludedTrusts.includes(trust)) {
    return true;
  }
  return false;
};
