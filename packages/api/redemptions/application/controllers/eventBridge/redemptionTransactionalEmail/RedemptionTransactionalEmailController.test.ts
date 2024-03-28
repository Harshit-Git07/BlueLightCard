import { Braze } from 'braze-api';

import { RedemptionTransactionalEmailController } from '@blc-mono/redemptions/application/controllers/eventBridge/redemptionTransactionalEmail/RedemptionTransactionalEmailController';
import { EmailRepository } from '@blc-mono/redemptions/application/repositories/EmailRepository';
import { EmailService } from '@blc-mono/redemptions/application/services/email/EmailService';
import { RedemptionEventDetailType } from '@blc-mono/redemptions/infrastructure/eventBridge/events/redemptions';
import { BrazeCredentials, BrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';
import { emailEventFactory } from '@blc-mono/redemptions/libs/test/factories/emailEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';
const setup = () => {
  process.env.BRAZE_API_URL = 'https://rest.fra-02.braze.com.eu';
  process.env.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID = 'test';
};

const teardown = () => {
  delete process.env.BRAZE_API_URL;
  delete process.env.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID;
};

jest.mock('braze-api');
describe('RedemptionTransactionalEmailController', () => {
  beforeEach(() => {
    setup();
  });

  afterAll(() => {
    teardown();
  });

  it(`should send email for ${RedemptionEventDetailType.REDEEMED_VAULT}`, async () => {
    const logger = createTestLogger();
    const secretsManger = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          brazeApiKey: 'test',
        } satisfies BrazeCredentials),
      ),
    } satisfies ISecretsManager;
    const emailClient = new BrazeEmailClientProvider(secretsManger);

    const emailRepository = new EmailRepository(logger, emailClient);
    const brazeEmail = new EmailService(emailRepository);
    const controller = new RedemptionTransactionalEmailController(logger, brazeEmail);
    await brazeEmail.sendRedemptionTransactionEmail(emailEventFactory.build());
    const spyEmailRepository = jest.spyOn(emailRepository, 'sendVaultRedemptionTransactionalEmail');
    Braze.prototype.campaigns = {
      list: jest.fn(),
      trigger: {
        schedule: {
          delete: jest.fn(),
          update: jest.fn(),
          create: jest.fn(),
        },
        send: jest.fn().mockResolvedValue({
          dispatch_id: 'test',
          message: 'success',
        }),
      },
    };

    const emailEvent = emailEventFactory.build({
      detail: {
        redemptionDetails: {
          redemptionType: RedemptionEventDetailType.REDEEMED_VAULT,
        },
      },
    });

    await controller.handle(emailEvent);
    expect(spyEmailRepository).toHaveBeenCalledWith(emailEvent.detail);
    expect(logger.info).toHaveBeenCalledWith({
      message: 'successfully sent email',
      context: { dispatch_id: 'test', message: 'success' },
    });
  });
  it('did not send an email', async () => {
    const logger = createTestLogger();
    const secretsManger = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          brazeApiKey: 'test',
        } satisfies BrazeCredentials),
      ),
    } satisfies ISecretsManager;
    const emailRepository = new EmailRepository(logger, new BrazeEmailClientProvider(secretsManger));
    const brazeEmail = new EmailService(emailRepository);
    const controller = new RedemptionTransactionalEmailController(logger, brazeEmail);
    await brazeEmail.sendRedemptionTransactionEmail(emailEventFactory.build());

    Braze.prototype.campaigns = {
      list: jest.fn(),
      trigger: {
        schedule: {
          delete: jest.fn(),
          update: jest.fn(),
          create: jest.fn(),
        },
        send: jest.fn().mockResolvedValue({
          dispatch_id: 'test',
          message: 'failed',
        }),
      },
    };

    const emailEvent = emailEventFactory.build({
      detail: {
        redemptionDetails: {
          redemptionType: RedemptionEventDetailType.REDEEMED_VAULT,
        },
      },
    });

    await expect(controller.handle(emailEvent)).rejects.toThrow('Failed to send email');

    expect(logger.info).toHaveBeenCalledWith({
      message: 'Failed to send email',
      context: { dispatch_id: 'test', message: 'failed' },
    });
  });

  it(`should not send email for ${RedemptionEventDetailType.REDEEMED_VAULT_QR}`, async () => {
    const logger = createTestLogger();
    const secretsManger = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          brazeApiKey: 'test',
        } satisfies BrazeCredentials),
      ),
    } satisfies ISecretsManager;
    const emailRepository = new EmailRepository(logger, new BrazeEmailClientProvider(secretsManger));
    const brazeEmail = new EmailService(emailRepository);
    const controller = new RedemptionTransactionalEmailController(logger, brazeEmail);
    await brazeEmail.sendRedemptionTransactionEmail(emailEventFactory.build());
    const spyEmailRepository = jest.spyOn(emailRepository, 'sendVaultRedemptionTransactionalEmail');

    const emailEvent = emailEventFactory.build({
      detail: {
        redemptionDetails: {
          redemptionType: RedemptionEventDetailType.REDEEMED_VAULT_QR,
        },
      },
    });

    await controller.handle(emailEvent);
    expect(spyEmailRepository).not.toHaveBeenCalled();
  });
});
