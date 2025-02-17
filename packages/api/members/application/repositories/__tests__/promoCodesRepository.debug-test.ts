/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';

jest.mock('@blc-mono/members/application/providers/Tables', () => ({
  memberProfilesTableName: () => 'staging-blc-mono-memberProfiles',
}));

const promoCodesRepository = new PromoCodesRepository();

it('should return a promo code', async () => {
  const result =
    await promoCodesRepository.getMultiUseOrSingleUseChildPromoCode('SKIP ID AND PAYMENT');

  expect(result).toEqual([
    {
      active: true,
      bypassPayment: true,
      bypassVerification: true,
      cardValidityTerm: 2,
      code: 'SKIP ID AND PAYMENT',
      codeProvider: '4489d238-245d-472f-ba17-582d68fd2bd7',
      createdDate: '2021-09-07T12:21:17.000Z',
      currentUsages: 0,
      description: 'For all',
      lastUpdatedDate: '2021-09-07T12:21:17.000Z',
      maxUsages: 999999999,
      name: 'Skip ID and Payment for testing',
      parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      promoCodeType: 'MULTI_USE',
      validityEndDate: '2030-01-01T00:00:00.000Z',
      validityStartDate: '2020-01-01T00:00:00.000Z',
    },
  ]);
});
