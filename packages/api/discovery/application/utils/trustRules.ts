export const isValidTrust = (trust: string, includedTrusts: string[], excludedTrusts: string[]): boolean => {
  if (excludedTrusts.includes(trust)) {
    return false;
  }
  if (includedTrusts.length === 0 || includedTrusts.includes(trust)) {
    return true;
  }
  return false;
};
