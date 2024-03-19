import { ILegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';

import { createTestLogger } from '../../test/helpers/logger';

import { SpotifyService } from './SpotifyService';

describe('SpotifyService', () => {
  async function callSpotifyRedeemService(
    platform: string,
    companyId: number,
    offerId: number,
    memberId: string,
    url: string,
    legacyVaultApiRepository?: ILegacyVaultApiRepository,
  ) {
    const mockedLogger = createTestLogger();
    const mockedLegacyVaultApiRepository: ILegacyVaultApiRepository = {
      assignCodeToMember: jest.fn(),
      getNumberOfCodesIssued: jest.fn(),
      getVaultByLinkId: jest.fn(),
      redeemCode: jest.fn(),
      getResponseData: jest.fn(),
    };
    const service = new SpotifyService(legacyVaultApiRepository ?? mockedLegacyVaultApiRepository, mockedLogger);
    return service.redeem(platform, companyId, offerId, memberId, url);
  }

  describe('redeem', () => {
    it('Should throw error with message "Could not send request to code redeemed API" when codeRedeemedResponse is undefined', async () => {
      // Arrange
      const platform = 'BLC_UK';
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com';

      // Act
      const result = callSpotifyRedeemService(platform, companyId, offerId, memberId, url);

      // Assert
      expect(
        result.catch((err) => {
          expect(err.message).toBe('Could not send request to code redeemed API');
        }),
      );
    });

    it('Should throw error with message "Code redeemed API request non successful" when codeRedeemedData is undefined', async () => {
      // Arrange
      const platform = 'BLC_UK';
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com';
      const mockedLegacyVaultApiRepository: ILegacyVaultApiRepository = {
        redeemCode: jest.fn().mockResolvedValue({ foo: 'bar' }),
        getResponseData: jest.fn().mockReturnValue(undefined),
        assignCodeToMember: jest.fn(),
        getNumberOfCodesIssued: jest.fn(),
        getVaultByLinkId: jest.fn(),
      };

      // Act
      const result = callSpotifyRedeemService(
        platform,
        companyId,
        offerId,
        memberId,
        url,
        mockedLegacyVaultApiRepository,
      );

      // Assert
      expect(
        result.catch((err) => {
          expect(err.message).toBe('Code redeemed API request non successful');
        }),
      );
    });

    it('Should return kind equals to "CodeRedemedOk" when codeRedeemedData has codes', async () => {
      // Arrange
      const platform = 'BLC_UK';
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com';

      const desiredCode = 1;
      const desiredCodes = [1, 2];
      const desiredTrackingUrl = 'trackingUrl';
      const mockedLegacyVaultApiRepository: ILegacyVaultApiRepository = {
        redeemCode: jest.fn().mockResolvedValue({ foo: 'bar' }),
        getResponseData: jest
          .fn()
          .mockReturnValue({ codes: desiredCodes, code: desiredCode, trackingUrl: desiredTrackingUrl }),
        assignCodeToMember: jest.fn(),
        getNumberOfCodesIssued: jest.fn(),
        getVaultByLinkId: jest.fn(),
      };

      // Act
      const result = await callSpotifyRedeemService(
        platform,
        companyId,
        offerId,
        memberId,
        url,
        mockedLegacyVaultApiRepository,
      );

      // Assert
      expect(result.kind).toBe('CodeRedemedOk');
      if (result.kind === 'CodeRedemedOk') {
        expect(result.data.code).toEqual(desiredCode);
        expect(result.data.trackingUrl).toEqual(desiredTrackingUrl);
      }
    });

    it('Should throw error with message "Could not send request to assign code API" when assignUserResponse is undefined', async () => {
      // Arrange
      const platform = 'BLC_UK';
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com';
      const mockedLegacyVaultApiRepository: ILegacyVaultApiRepository = {
        redeemCode: jest.fn().mockResolvedValue({ foo: 'bar' }),
        getResponseData: jest.fn().mockReturnValue({ codes: [] }),
        assignCodeToMember: jest.fn().mockResolvedValue(undefined),
        getNumberOfCodesIssued: jest.fn(),
        getVaultByLinkId: jest.fn(),
      };

      // Act
      const result = callSpotifyRedeemService(
        platform,
        companyId,
        offerId,
        memberId,
        url,
        mockedLegacyVaultApiRepository,
      );

      // Assert
      expect(
        result.catch((err) => {
          expect(err.message).toBe('Could not send request to assign code API');
        }),
      );
    });

    it('Should throw error with message "Assign code API request non successful" when assignedUserResponseData is undefined', async () => {
      // Arrange
      const platform = 'BLC_UK';
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com';
      const mockedLegacyVaultApiRepository: ILegacyVaultApiRepository = {
        redeemCode: jest.fn().mockResolvedValue({ foo: 'bar' }),
        getResponseData: jest.fn().mockReturnValueOnce({ codes: [] }).mockReturnValue(undefined),
        assignCodeToMember: jest.fn().mockResolvedValue({ foo: 'bar' }),
        getNumberOfCodesIssued: jest.fn(),
        getVaultByLinkId: jest.fn(),
      };

      // Act
      const result = callSpotifyRedeemService(
        platform,
        companyId,
        offerId,
        memberId,
        url,
        mockedLegacyVaultApiRepository,
      );

      // Assert
      expect(
        result.catch((err) => {
          expect(err.message).toBe('Assign code API request non successful');
        }),
      );
    });

    it('Should return kind equals to "AssignUserCodeOk" when assignedUserResponseData is defined', async () => {
      // Arrange
      const platform = 'BLC_UK';
      const companyId = 1;
      const offerId = 1;
      const memberId = 'memberId';
      const url = 'https://www.blcshine.com';
      const desiredCode = 1;
      const desiredTrackingUrl = 'trackingUrl';
      const mockedLegacyVaultApiRepository: ILegacyVaultApiRepository = {
        redeemCode: jest.fn().mockResolvedValue({ foo: 'bar' }),
        getResponseData: jest
          .fn()
          .mockReturnValueOnce({ codes: [] })
          .mockReturnValue({ code: desiredCode, trackingUrl: desiredTrackingUrl }),
        assignCodeToMember: jest.fn().mockResolvedValue({ foo: 'bar' }),
        getNumberOfCodesIssued: jest.fn(),
        getVaultByLinkId: jest.fn(),
      };

      // Act
      const result = await callSpotifyRedeemService(
        platform,
        companyId,
        offerId,
        memberId,
        url,
        mockedLegacyVaultApiRepository,
      );

      // Assert
      expect(result.kind).toBe('AssignUserCodeOk');
      if (result.kind === 'AssignUserCodeOk') {
        expect(result.data.code).toEqual(desiredCode);
        expect(result.data.trackingUrl).toEqual(desiredTrackingUrl);
        expect(result.data.dwh).toEqual(true);
      }
    });
  });
});
