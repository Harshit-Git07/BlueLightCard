/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';

jest.mock('@blc-mono/members/application/services/profileService', () => ({
  ProfileService: jest.fn().mockImplementation(() => ({
    getProfile: jest.fn(),
  })),
}));

const promoCodesRepository = new PromoCodesRepository(
  defaultDynamoDbClient,
  'pr-3501-blc-mono-blc-mono-memberProfiles',
);
const profileService = new ProfileService() as jest.Mocked<ProfileService>;

const promoCodesService = new PromoCodesService(promoCodesRepository, profileService);

beforeEach(() => {
  jest.resetAllMocks();

  profileService.getProfile.mockResolvedValue({
    employerId: '0786a4b7-74a1-4efc-ba8f-89ac798e1aea',
  } as unknown as ProfileModel);
});

it('should return a promo code', async () => {
  const result = await promoCodesService.validatePromoCode(
    'e57d0310-140c-4487-abe5-71e30f4efac7',
    'SKIP_ID_AND_PAYMENT',
  );

  expect(result).toEqual({
    bypassPayment: true,
    bypassVerification: true,
  });
});
