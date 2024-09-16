import { ILegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';

import { createTestLogger } from '../../../libs/test/helpers/logger';

import { SpotifyService } from './SpotifyService';

describe('SpotifyService', () => {
  function callSpotifyRedeemService(
    companyId: number,
    offerId: number,
    memberId: string,
    url: string,
    legacyVaultApiRepository?: ILegacyVaultApiRepository,
  ) {
    const mockedLogger = createTestLogger();
    const mockedLegacyVaultApiRepository: ILegacyVaultApiRepository = {
      assignCodeToMember: jest.fn(),
      assignCodeToMemberWithErrorHandling: jest.fn(),
      getNumberOfCodesIssuedByMember: jest.fn(),
      findVaultsRelatingToLinkId: jest.fn(),
      getCodesRedeemed: jest.fn(),
      checkVaultStock: jest.fn(),
      viewVaultBatches: jest.fn(),
    };
    const service = new SpotifyService(legacyVaultApiRepository ?? mockedLegacyVaultApiRepository, mockedLogger);
    return service.redeem(companyId, offerId, memberId, url);
  }

  describe('redeem', () => {
    it('should return a tracking URL for an already redeemed code', async () => {
      // Arrange
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com?code=!!!CODE!!!';
      const mockedLegacyVaultApiRepository = {
        getCodesRedeemed: jest.fn().mockResolvedValue(['bar', 'baz']),
        assignCodeToMember: jest.fn(),
        assignCodeToMemberWithErrorHandling: jest.fn(),
        getNumberOfCodesIssuedByMember: jest.fn(),
        findVaultsRelatingToLinkId: jest.fn(),
        checkVaultStock: jest.fn(),
        viewVaultBatches: jest.fn(),
      } satisfies ILegacyVaultApiRepository;

      // Act
      const result = await callSpotifyRedeemService(companyId, offerId, memberId, url, mockedLegacyVaultApiRepository);

      // Assert
      expect(result.kind).toBe('Ok');
      expect(result.data.code).toEqual('bar');
      expect(result.data.trackingUrl).toEqual('https://www.blcshine.com?code=bar');
    });

    it('should assign a code when no code is already redeemed', async () => {
      // Arrange
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com?code=!!!CODE!!!';
      const mockedLegacyVaultApiRepository = {
        getCodesRedeemed: jest.fn().mockResolvedValue([]),
        assignCodeToMember: jest.fn().mockResolvedValue({ code: 'bar' }),
        assignCodeToMemberWithErrorHandling: jest.fn(),
        getNumberOfCodesIssuedByMember: jest.fn(),
        findVaultsRelatingToLinkId: jest.fn(),
        checkVaultStock: jest.fn(),
        viewVaultBatches: jest.fn(),
      } satisfies ILegacyVaultApiRepository;

      // Act
      const result = await callSpotifyRedeemService(companyId, offerId, memberId, url, mockedLegacyVaultApiRepository);

      // Assert
      expect(result.kind).toBe('Ok');
      expect(result.data.code).toEqual('bar');
      expect(result.data.trackingUrl).toEqual('https://www.blcshine.com?code=bar');
      expect(result.data.dwh).toEqual(true);
    });
  });
});
