import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

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
          sendShowCardEmail: jest.fn(),
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
        sendShowCardEmail: jest.fn(),
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

    it('should send email for showCard redemption events', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository = {
        sendVaultOrGenericTransactionalEmail: jest.fn(),
        sendPreAppliedTransactionalEmail: jest.fn(),
        sendShowCardEmail: jest.fn(),
      } satisfies IEmailRepository;
      const service = new EmailService(logger, emailRepository);
      const event = memberRedemptionEventFactory.build({
        detail: {
          redemptionDetails: {
            redemptionType: 'showCard',
          },
        },
      });

      // Act
      await service.sendRedemptionTransactionEmail(event);

      // Assert
      expect(emailRepository.sendShowCardEmail).toHaveBeenCalled();
    });
  });
});
