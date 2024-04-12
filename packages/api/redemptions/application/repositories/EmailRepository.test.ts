import { as } from '@blc-mono/core/utils/testing';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { IBrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { redemptionTransactionalEmailPayloadFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionTransactionalEmailPayload.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { EmailRepository } from './EmailRepository';

describe('EmailRepository', () => {
  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID];
  });

  describe('sendVaultRedemptionTransactionalEmail', () => {
    it('should send an email with the braze email client', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID] = 'test';
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
        // TODO(TR-437): Check the correct URL
        url: expect.any(String),
      });
    });

    it('should throw when success is not returned by Braze', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID] = 'test';
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
