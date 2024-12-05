import { IEmailService } from '@blc-mono/redemptions/application/services/email/EmailService';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedemptionTransactionalEmailController } from './RedemptionTransactionalEmailController';

describe('RedemptionTransactionalEmailController', () => {
  it('should send email for redemption events', async () => {
    // Arrange
    const logger = createTestLogger();
    const mockEmailService = {
      sendRedemptionTransactionEmail: jest.fn(),
      setCustomAttributes: jest.fn(),
    } satisfies IEmailService;
    const controller = new RedemptionTransactionalEmailController(logger, mockEmailService);
    const event = memberRedemptionEventFactory.build();

    // Act
    await controller.handle(event);

    // Assert
    expect(mockEmailService.sendRedemptionTransactionEmail).toHaveBeenCalledWith(event);
  });
});
