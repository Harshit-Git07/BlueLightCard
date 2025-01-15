import { UserService } from '@blc-mono/identity/src/services/UserService';

import { getUserDetails } from './getUserDetails';

jest.mock('@blc-mono/core/utils/getEnv');

const defaultUserDetails = {
  brand: 'BLC_UK',
  canRedeemOffer: true,
  cards: [],
  companies_follows: [],
  legacyId: 2853201,
  profile: {
    dob: undefined,
    email: 'testEmail@blc.uk',
    emailValidated: 1,
    firstname: 'Test',
    gender: 'F',
    mobile: '+44712345678',
    organisation: 'AMBU',
    service: undefined,
    spareEmail: 'testEmail@blc.uk',
    spareEmailValidated: 1,
    surname: 'User',
    twoFactorAuthentication: false,
    uuid: undefined,
  },
  uuid: '068385bb-b370-4153-9474-51dd0bfac9dc',
};

describe('getUserDetails', () => {
  const mockUserDetails = { dob: '2001-01-01', organisation: 'DEN' };
  const mockUserDetailsNoDob = { dob: '2004-01-01', organisation: 'DEN' };

  beforeEach(() => {
    jest
      .spyOn(UserService.prototype, 'findUserDetails')
      .mockResolvedValue({ ...defaultUserDetails, profile: mockUserDetails });
  });

  it('should return user details with dob', async () => {
    const result = await getUserDetails('1234');

    expect(result).toEqual(mockUserDetails);
  });

  it('should return user details with default dob', async () => {
    jest
      .spyOn(UserService.prototype, 'findUserDetails')
      .mockResolvedValue({ ...defaultUserDetails, profile: mockUserDetailsNoDob });

    const result = await getUserDetails('1234');

    expect(result).toEqual(mockUserDetailsNoDob);
  });

  it('should return undefined if no profile', async () => {
    jest.spyOn(UserService.prototype, 'findUserDetails').mockResolvedValue(null);

    const result = await getUserDetails('1234');

    expect(result).toBeUndefined();
  });
});
