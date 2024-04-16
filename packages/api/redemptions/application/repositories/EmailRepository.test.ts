import { mocked } from 'jest-mock';
import * as process from 'process';

import { as } from '@blc-mono/core/utils/testing';
import { encodeBase64 } from '@blc-mono/redemptions/application/helpers/encodeBase64';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { IBrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { redemptionTransactionalEmailPayloadFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionTransactionalEmailPayload.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { EmailRepository } from './EmailRepository';

jest.mock('../helpers/encodeBase64');
describe('EmailRepository', () => {
  beforeEach(() => {
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID] = 'test';
    process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST] = 'https://staging.bluelightcard.co.uk';
  });

  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST];
  });

  describe('sendVaultRedemptionTransactionalEmail', () => {
    it('should send an email with the braze email client', async () => {
      // Arrange

      const logger = createTestLogger();
      const mockEmailClient = {
        campaigns: {
          trigger: {
            send: jest.fn().mockResolvedValue({
              message: 'success',
            }),
          },
        },
      };
      const emailClientProvider: IBrazeEmailClientProvider = {
        getClient: () => Promise.resolve(as(mockEmailClient)),
      };

      const mockBase64 = 'mockedBase64String';
      mocked(encodeBase64).mockReturnValue(mockBase64);
      mocked(encodeBase64).mockReturnValue(mockBase64);

      const host = 'https://staging.bluelightcard.co.uk';

      const repository = new EmailRepository(logger, emailClientProvider);
      const payload = redemptionTransactionalEmailPayloadFactory.build();

      // Act
      await repository.sendVaultRedemptionTransactionalEmail(payload);

      // Assert
      expect(mockEmailClient.campaigns.trigger.send).toHaveBeenCalled();
      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual('test');
      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
        payload.memberDetails.brazeExternalUserId,
      );

      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
        companyName: payload.redemptionDetails.companyName,
        offerName: payload.redemptionDetails.offerName,
        url: `${host}/copy-code?code=${mockBase64}&redirect=${payload.redemptionDetails.url}&metaData=${mockBase64}`,
      });
    });

    it('should throw when success is not returned by Braze', async () => {
      // Arrange
      const logger = createTestLogger();
      const mockEmailClient = {
        campaigns: {
          trigger: {
            send: jest.fn().mockResolvedValue({
              message: 'failure',
            }),
          },
        },
      };
      const emailClientProvider: IBrazeEmailClientProvider = {
        getClient: () => Promise.resolve(as(mockEmailClient)),
      };

      const repository = new EmailRepository(logger, emailClientProvider);
      const payload = redemptionTransactionalEmailPayloadFactory.build();

      // Act
      const act = () => repository.sendVaultRedemptionTransactionalEmail(payload);

      // Assert
      await expect(act).rejects.toThrow();
    });
  });
});
