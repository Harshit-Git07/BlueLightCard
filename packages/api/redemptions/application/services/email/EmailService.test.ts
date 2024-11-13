import { as } from '@blc-mono/core/utils/testing';
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
        const emailRepository: Partial<IEmailRepository> = {
          sendVaultOrGenericTransactionalEmail: jest.fn(),
        };
        const service = new EmailService(logger, as(emailRepository));
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

    it.each(['giftCard', 'preApplied'])('sends email for %s Affiliate redemption events', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository: Partial<IEmailRepository> = {
        sendAffiliateTransactionalEmail: jest.fn(),
      };
      const service = new EmailService(logger, as(emailRepository));
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
      expect(emailRepository.sendAffiliateTransactionalEmail).toHaveBeenCalled();
    });

    it('sends email for showCard redemption events', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository: Partial<IEmailRepository> = {
        sendShowCardEmail: jest.fn(),
      };
      const service = new EmailService(logger, as(emailRepository));
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
