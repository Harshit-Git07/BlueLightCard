import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IEmailRepository } from '../../repositories/EmailRepository';

import { EmailService } from './EmailService';

describe('EmailService', () => {
  describe('sendPaymentSucceededEmail', () => {
    it('should throw when there is no Braze external Id in the metadata of the payment event', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository = {
        sendPaymentSucceededEmail: jest.fn(),
      } satisfies IEmailRepository;

      const service = new EmailService(logger, emailRepository);

      const event: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: 12234423,
        metadata: { something: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      };

      // Assert
      await expect(service.sendPaymentSucceededEmail(event)).rejects.toThrow(
        'No Braze External Id associated with member on payment event',
      );
      expect(emailRepository.sendPaymentSucceededEmail).not.toHaveBeenCalled();
    });

    it('should throw when member Id is not set on the payment event', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository = {
        sendPaymentSucceededEmail: jest.fn(),
      } satisfies IEmailRepository;

      const service = new EmailService(logger, emailRepository);

      const event: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: 12234423,
        metadata: { brazeExternalId: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
      };

      // Assert
      await expect(service.sendPaymentSucceededEmail(event)).rejects.toThrow('No member associated with payment event');
      expect(emailRepository.sendPaymentSucceededEmail).not.toHaveBeenCalled();
    });

    it('should send email when there member Id and braze external Id is set on the payment event', async () => {
      // Arrange
      const logger = createTestLogger();
      const emailRepository = {
        sendPaymentSucceededEmail: jest.fn(),
      } satisfies IEmailRepository;

      const service = new EmailService(logger, emailRepository);

      const event: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: 12234423,
        metadata: {},
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '123', brazeExternalId: '1234567890' },
      };

      // Act
      await service.sendPaymentSucceededEmail(event);

      // Assert
      expect(emailRepository.sendPaymentSucceededEmail).toHaveBeenCalledWith({
        member: { id: '123', brazeExternalId: '1234567890' },
        amount: 499,
      });
    });
  });
});
