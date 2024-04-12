import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import { emailEventFactory } from '@blc-mono/redemptions/libs/test/factories/emailEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IEmailRepository } from '../../repositories/EmailRepository';

import { EmailService } from './EmailService';

describe('EmailService', () => {
  describe('sendRedemptionTransactionEmail', () => {
    it('should send email for redemption events', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository = {
        sendVaultRedemptionTransactionalEmail: jest.fn(),
      } satisfies IEmailRepository;
      const service = new EmailService(logger, emailRepository);
      const event = emailEventFactory.build({
        detail: {
          redemptionDetails: {
            redemptionType: 'vault',
          },
        },
      });

      // Act
      await service.sendRedemptionTransactionEmail(event);

      // Assert
      expect(emailRepository.sendVaultRedemptionTransactionalEmail).toHaveBeenCalled();
    });

    it.each([['generic'], ['preApplied'], ['showCard'], ['vaultQR']] satisfies [RedemptionType][])(
      'should throw error for unhandled redemption type',
      async (redemptionType) => {
        // Arrange
        const logger = createTestLogger();
        const emailRepository = {
          sendVaultRedemptionTransactionalEmail: jest.fn(),
        } satisfies IEmailRepository;
        const service = new EmailService(logger, emailRepository);
        const event = emailEventFactory.build({
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
        expect(emailRepository.sendVaultRedemptionTransactionalEmail).not.toHaveBeenCalled();
      },
    );
  });
});
