import { mocked } from 'jest-mock';

import { REDEMPTION_TYPES, RedemptionTypes } from '@blc-mono/core/constants/redemptions';
import { as } from '@blc-mono/core/utils/testing';
import { encodeBase64 } from '@blc-mono/redemptions/application/helpers/encodeBase64';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { IBrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import {
  affiliateEmailPayloadFactory,
  vaultOrGenericEmailPayloadFactory,
} from '@blc-mono/redemptions/libs/test/factories/brazePayload.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { EmailRepository } from './EmailRepository';

jest.mock('../helpers/encodeBase64');

const allExceptRedemptionTypes = (...redemptionTypes: RedemptionTypes[]): RedemptionTypes[] => {
  return REDEMPTION_TYPES.filter((type) => !redemptionTypes.includes(type));
};

describe('EmailRepository', () => {
  beforeEach(() => {
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID] = 'test';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID] = 'test';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_GIFT_CARD_EMAIL_CAMPAIGN_ID] = 'giftCard_env_val';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID] = 'preApplied_env_val';
    process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST] = 'https://staging.bluelightcard.co.uk';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID] = 'test';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID] = 'test';
    process.env[RedemptionsStackEnvironmentKeys.BRAZE_CREDIT_CARD_EMAIL_CAMPAIGN_ID] = 'creditCard_env_val';
  });

  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_GIFT_CARD_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID];
    delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_CREDIT_CARD_EMAIL_CAMPAIGN_ID];
  });

  describe('sendVaultOrGenericTransactionalEmail', () => {
    it.each(['vault', 'generic'] as const)(
      'sends an email via Braze for %s redemption type',
      async (redemptionType) => {
        const logger = createTestLogger();
        const mockBrazeEmailClient = {
          campaigns: {
            trigger: {
              send: jest.fn().mockResolvedValue({
                message: 'success',
              }),
            },
          },
        };
        const brazeEmailClientProvider: IBrazeEmailClientProvider = {
          getClient: () => Promise.resolve(as(mockBrazeEmailClient)),
        };

        const mockBase64 = 'mockedBase64String';
        mocked(encodeBase64).mockReturnValue(mockBase64);
        mocked(encodeBase64).mockReturnValue(mockBase64);

        const host = 'https://staging.bluelightcard.co.uk';

        const repository = new EmailRepository(logger, brazeEmailClientProvider);
        const payload = vaultOrGenericEmailPayloadFactory.build();

        // Act
        await repository.sendVaultOrGenericTransactionalEmail(payload, redemptionType);

        // Assert
        expect(mockBrazeEmailClient.campaigns.trigger.send).toHaveBeenCalledTimes(1);
        expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual('test');
        expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
          payload.brazeExternalUserId,
        );

        expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
          companyName: payload.companyName,
          offerName: payload.offerName,
          url: `${host}/copy-code?code=${mockBase64}&redirect=${mockBase64}&metaData=${mockBase64}`,
          code: payload.code,
        });
      },
    );

    it('sends an email via Braze for vaultQR redemption type', async () => {
      const logger = createTestLogger();
      const mockBrazeEmailClient = {
        campaigns: {
          trigger: {
            send: jest.fn().mockResolvedValue({
              message: 'success',
            }),
          },
        },
      };
      const emailClientProvider: IBrazeEmailClientProvider = {
        getClient: () => Promise.resolve(as(mockBrazeEmailClient)),
      };

      const mockBase64 = 'mockedBase64String';
      mocked(encodeBase64).mockReturnValue(mockBase64);
      mocked(encodeBase64).mockReturnValue(mockBase64);

      const repository = new EmailRepository(logger, emailClientProvider);
      const payload = vaultOrGenericEmailPayloadFactory.build();

      // Act
      await repository.sendVaultOrGenericTransactionalEmail(payload, 'vaultQR');

      // Assert
      expect(mockBrazeEmailClient.campaigns.trigger.send).toHaveBeenCalled();
      expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual('test');
      expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
        payload.brazeExternalUserId,
      );

      expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
        companyName: payload.companyName,
        offerName: payload.offerName,
        code: payload.code,
      });
    });

    it('throws an error when Braze returns a failure', async () => {
      // Arrange
      const logger = createTestLogger();
      const mockBrazeEmailClient = {
        campaigns: {
          trigger: {
            send: jest.fn().mockResolvedValue({
              message: 'failure',
            }),
          },
        },
      };
      const emailClientProvider: IBrazeEmailClientProvider = {
        getClient: () => Promise.resolve(as(mockBrazeEmailClient)),
      };

      const repository = new EmailRepository(logger, emailClientProvider);
      const payload = vaultOrGenericEmailPayloadFactory.build();

      // Act
      const act = () => repository.sendVaultOrGenericTransactionalEmail(payload, 'vault');

      // Assert
      await expect(act).rejects.toThrow();
    });

    it.each(allExceptRedemptionTypes('generic', 'vault', 'vaultQR'))(
      'throws an error for unhandled redemption type %s',
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
        expect(logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            message: `redemption type is incorrect for vault/generic email template: ${redemptionType}`,
          }),
        );
      },
    );
  });

  describe('sendAffiliateTransactionalEmail', () => {
    it.each(['creditCard', 'giftCard', 'preApplied'] as const)(
      'sends an email with the braze email client for %s redemption type',
      async (redemptionType) => {
        const logger = createTestLogger();

        const mockBrazeEmailClient = {
          campaigns: {
            trigger: {
              send: jest.fn().mockResolvedValue({
                message: 'success',
              }),
            },
          },
        };

        const emailClientProvider: IBrazeEmailClientProvider = {
          getClient: () => Promise.resolve(as(mockBrazeEmailClient)),
        };

        const repository = new EmailRepository(logger, emailClientProvider);
        const payload = affiliateEmailPayloadFactory.build();

        await repository.sendAffiliateTransactionalEmail(payload, redemptionType);

        expect(mockBrazeEmailClient.campaigns.trigger.send).toHaveBeenCalled();
        expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual(
          `${redemptionType}_env_val`,
        );
        expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
          payload.brazeExternalUserId,
        );

        expect(mockBrazeEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
          companyName: payload.companyName,
          offerName: payload.offerName,
          url: payload.url,
        });
      },
    );

    it('throws an error when Braze returns a failure', async () => {
      // Arrange
      const logger = createTestLogger();
      const mockBrazeEmailClient = {
        campaigns: {
          trigger: {
            send: jest.fn().mockResolvedValue({
              message: 'failure',
            }),
          },
        },
      };
      const emailClientProvider: IBrazeEmailClientProvider = {
        getClient: () => Promise.resolve(as(mockBrazeEmailClient)),
      };

      const repository = new EmailRepository(logger, emailClientProvider);
      const payload = affiliateEmailPayloadFactory.build();

      // Act
      const act = () => repository.sendAffiliateTransactionalEmail(payload, 'preApplied');

      // Assert
      await expect(act).rejects.toThrow();
    });

    it.each(allExceptRedemptionTypes('creditCard', 'giftCard', 'preApplied'))(
      'throws an error for unhandled redemption type %s',
      async (redemptionType) => {
        // Arrange
        const logger = createTestLogger();
        const mockEmailClient = {};
        const emailClientProvider: IBrazeEmailClientProvider = {
          getClient: () => Promise.resolve(as(mockEmailClient)),
        };
        const repository = new EmailRepository(logger, emailClientProvider);
        const payload = affiliateEmailPayloadFactory.build();

        // Act
        const act = () => repository.sendAffiliateTransactionalEmail(payload, redemptionType);

        // Assert
        await expect(act).rejects.toThrow(`RedemptionType error, expects Affiliate`);
        expect(logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            message: `no campaign identifier for Affiliate email template: ${redemptionType}`,
          }),
        );
      },
    );
  });

  describe('sendShowCardEmail', () => {
    it('sends an email for showCard redemption type', async () => {
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
      const repository = new EmailRepository(logger, emailClientProvider);
      const payload = {
        brazeExternalUserId: 'test',
        companyName: 'test',
        redemptionType: 'showCard',
      } as const;

      // Act
      await repository.sendShowCardEmail(payload);
      expect(mockEmailClient.campaigns.trigger.send).toHaveBeenCalled();
      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual('test');
      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id).toEqual(
        payload.brazeExternalUserId,
      );

      expect(mockEmailClient.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
        companyName: payload.companyName,
      });
    });

    it.each(allExceptRedemptionTypes('showCard'))(
      'throws an error for unhandled redemption type %s',
      async (redemptionType) => {
        // Arrange
        const logger = createTestLogger();
        const mockEmailClient = {};
        const emailClientProvider: IBrazeEmailClientProvider = {
          getClient: () => Promise.resolve(as(mockEmailClient)),
        };
        const repository = new EmailRepository(logger, emailClientProvider);
        const payload = {
          brazeExternalUserId: 'test',
          companyName: 'test',
          redemptionType: redemptionType,
        };

        // Act
        const act = () => repository.sendShowCardEmail(payload);

        // Assert
        await expect(act).rejects.toThrow('RedemptionType error, expects showCard');
        expect(logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            message: `redemption type is incorrect for show card email template: ${redemptionType}`,
          }),
        );
      },
    );
  });
});
