import { mocked } from 'jest-mock';
import * as process from 'process';

import { as } from '@blc-mono/core/utils/testing';
import { encodeBase64 } from '@blc-mono/redemptions/application/helpers/encodeBase64';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import { IBrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import {
  preAppliedEmailPayloadFactory,
  vaultOrGenericEmailPayloadFactory,
} from '@blc-mono/redemptions/libs/test/factories/redemptionTransactionalEmailPayload.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { EmailRepository } from './EmailRepository';

jest.mock('../helpers/encodeBase64');
describe('EmailRepository', () => {
  beforeEach(() => {
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID] = 'test';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID] = 'test';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID] = 'preApplied_env_val';
    process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST] = 'https://staging.bluelightcard.co.uk';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID] = 'test';
  });

  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID];
  });

  describe('sendVaultOrGenericTransactionalEmail', () => {
    it.each(['vault', 'generic'] satisfies RedemptionType[])(
      'should send an email with the braze email client',
      async (redemptionType) => {
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
        const payload = vaultOrGenericEmailPayloadFactory.build();

        // Act
        await repository.sendVaultOrGenericTransactionalEmail(payload, redemptionType);

        // Assert
        expect(mockEmailClient.campaigns.trigger.send).toHaveBeenCalled();
        expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual('test');
        expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
          payload.brazeExternalUserId,
        );

        expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
          companyName: payload.companyName,
          offerName: payload.offerName,
          url: `${host}/copy-code?code=${mockBase64}&redirect=${mockBase64}&metaData=${mockBase64}`,
          code: payload.code,
        });
      },
    );

    it('should send an email with the braze email client for vaultQR redemption type', async () => {
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

      const repository = new EmailRepository(logger, emailClientProvider);
      const payload = vaultOrGenericEmailPayloadFactory.build();

      // Act
      await repository.sendVaultOrGenericTransactionalEmail(payload, 'vaultQR');

      // Assert
      expect(mockEmailClient.campaigns.trigger.send).toHaveBeenCalled();
      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual('test');
      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
        payload.brazeExternalUserId,
      );

      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
        companyName: payload.companyName,
        offerName: payload.offerName,
        code: payload.code,
      });
    });

    describe('sendPreAppliedTransactionalEmail', () => {
      it('should send an email with the braze email client for preApplied redemption type', async () => {
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
        const payload = preAppliedEmailPayloadFactory.build();

        await repository.sendPreAppliedTransactionalEmail(payload);

        expect(mockEmailClient.campaigns.trigger.send).toHaveBeenCalled();
        expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual('preApplied_env_val');
        expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
          payload.brazeExternalUserId,
        );

        expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
          companyName: payload.companyName,
          offerName: payload.offerName,
          url: payload.url,
        });
      });
    });

    it.each(['showCard', 'preApplied'] satisfies RedemptionType[])(
      'should throw error for unhandled redemption type',
      async (redemptionType) => {
        // Arrange
        const logger = createTestLogger();
        const mockEmailClient = {};
        const emailClientProvider: IBrazeEmailClientProvider = {
          getClient: () => Promise.resolve(as(mockEmailClient)),
        };
        const repository = new EmailRepository(logger, emailClientProvider);
        const payload = vaultOrGenericEmailPayloadFactory.build();

        // Act
        const act = () => repository.sendVaultOrGenericTransactionalEmail(payload, redemptionType);

        // Assert
        await expect(act).rejects.toThrow('RedemptionType error, expects vault/generic');
      },
    );

    it('should throw when success is not returned by Braze for vault or generic emails', async () => {
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
      const payload = vaultOrGenericEmailPayloadFactory.build();
      const redemptionType: RedemptionType = 'vault';

      // Act
      const act = () => repository.sendVaultOrGenericTransactionalEmail(payload, redemptionType);

      // Assert
      await expect(act).rejects.toThrow();
    });

    it('should throw when success is not returned by Braze for preApplied emails', async () => {
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
      const payload = preAppliedEmailPayloadFactory.build();

      // Act
      const act = () => repository.sendPreAppliedTransactionalEmail(payload);

      // Assert
      await expect(act).rejects.toThrow();
    });
  });
});
