import { isValidTrust } from '@blc-mono/discovery/application/utils/trustRules';

describe('trustRules', () => {
  it('should return true if the users service is in the included trusts', () => {
    const result = isValidTrust('NHS', ['NHS'], []);

    expect(result).toBe(true);
  });
  it('should return false if the users service is in the excluded trusts', () => {
    const result = isValidTrust('NHS', [], ['NHS']);

    expect(result).toBe(false);
  });
  it('should return true when both included and excluded trusts are empty', () => {
    const result = isValidTrust('NHS', [], []);

    expect(result).toBe(true);
  });
  it('should return true when users service is not in the excluded trusts', () => {
    const result = isValidTrust('NHS', [], ['POLICE']);

    expect(result).toBe(true);
  });
  it('should return false when users service is not in the included trusts', () => {
    const result = isValidTrust('NHS', ['FIRE'], ['POLICE']);

    expect(result).toBe(false);
  });
});
