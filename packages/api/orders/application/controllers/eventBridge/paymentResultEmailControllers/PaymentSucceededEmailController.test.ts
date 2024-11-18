import { faker } from '@faker-js/faker';

import { PaymentsEventDetailType } from '@blc-mono/core/constants/payments';
import { PaymentSucceededEvent } from '@blc-mono/core/schemas/payments';
import { IEmailService } from '@blc-mono/orders/application/services/email/EmailService';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { PaymentSucceededEmailController } from './PaymentSucceededEmailController';

describe('PaymentSucceededEmailController', () => {
  it('should send email for payment succeeded events', async () => {
    // Arrange
    const logger = createTestLogger();
    const mockEmailService = {
      sendPaymentSucceededEmail: jest.fn(),
    } satisfies IEmailService;

    const controller = new PaymentSucceededEmailController(logger, mockEmailService);

    const event: PaymentSucceededEvent = {
      account: faker.string.numeric(12),
      detail: {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: 12234423,
        metadata: { brazeExternalUserId: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      },
      'detail-type': PaymentsEventDetailType.PAYMENT_SUCCEEDED,
      id: faker.string.uuid(),
      region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
      resources: ['payments.transactional.email'],
      source: 'payments.transactional.email',
      time: faker.date.recent().toISOString(),
      version: '0',
    };

    // Act
    await controller.handle(event);

    // Assert
    expect(mockEmailService.sendPaymentSucceededEmail).toHaveBeenCalledWith(event.detail);
  });
});
