import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IEmailRepository } from '../../repositories/EmailRepository';

import { EmailService } from './EmailService';

describe('EmailService', () => {
  describe('sendRedemptionTransactionEmail', () => {
    it.each(['vault', 'generic'] satisfies RedemptionType[])(
      'should send email for vault and generic redemption events',
      async (redemptionType) => {
        // Arrange
        const logger = createTestLogger();
        const emailRepository = {
          sendVaultOrGenericTransactionalEmail: jest.fn(),
          sendPreAppliedTransactionalEmail: jest.fn(),
        } satisfies IEmailRepository;
        const service = new EmailService(logger, emailRepository);
        const event = memberRedemptionEventFactory.build({
          detail: {
            redemptionDetails: {
              redemptionType: redemptionType,
            },
          },
        });

        // Act
        await service.sendRedemptionTransactionEmail(event);

        // Assert
        expect(emailRepository.sendVaultOrGenericTransactionalEmail).toHaveBeenCalled();
      },
    );

    it('should send email for preApplied redemption events', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository = {
        sendVaultOrGenericTransactionalEmail: jest.fn(),
        sendPreAppliedTransactionalEmail: jest.fn(),
      } satisfies IEmailRepository;
      const service = new EmailService(logger, emailRepository);
      const event = memberRedemptionEventFactory.build({
        detail: {
          redemptionDetails: {
            redemptionType: 'preApplied',
          },
        },
      });

      // Act
      await service.sendRedemptionTransactionEmail(event);

      // Assert
      expect(emailRepository.sendPreAppliedTransactionalEmail).toHaveBeenCalled();
    });

    it.each(['showCard', 'vaultQR'] satisfies RedemptionType[])(
      'should throw error for unhandled redemption type',
      async (redemptionType) => {
        // Arrange
        const logger = createSilentLogger();
        const emailRepository = {
          sendVaultOrGenericTransactionalEmail: jest.fn(),
          sendPreAppliedTransactionalEmail: jest.fn(),
        } satisfies IEmailRepository;
        const service = new EmailService(logger, emailRepository);
        const event = memberRedemptionEventFactory.build({
          detail: {
            redemptionDetails: {
              redemptionType,
            },
          },
        });

        // Act
        const act = () => service.sendRedemptionTransactionEmail(event);

        // Assert
        await expect(act).rejects.toThrow('Unhandled redemption type');
        expect(emailRepository.sendVaultOrGenericTransactionalEmail).not.toHaveBeenCalled();
      },
    );
  });
});
