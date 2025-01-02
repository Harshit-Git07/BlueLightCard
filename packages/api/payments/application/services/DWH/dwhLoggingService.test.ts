import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';

import { IDwhRepository } from '../../repositories/DwhRepository';

import { DwhLoggingService } from './dwhLoggingService';

describe('DwhLoggingService', () => {
  let mockRepository: jest.Mocked<IDwhRepository>;
  let loggingService: DwhLoggingService;

  beforeEach(() => {
    mockRepository = {
      logPaymentIntent: jest.fn(),
      logPaymentFailed: jest.fn(),
      logPaymentSucceeded: jest.fn(),
    } as unknown as jest.Mocked<IDwhRepository>;
    loggingService = new DwhLoggingService(mockRepository);
  });

  describe('logPaymentIntent', () => {
    it('should log payment intent event', async () => {
      const event: PaymentObjectEventDetail = {
        paymentIntentId: 'pi_123',
        amount: 1000,
        currency: 'gbp',
        created: new Date().getTime(),
        member: { id: 'member_123', brazeExternalId: 'braze_123' },
        metadata: {
          test: 'test',
        },
      };

      await loggingService.logPaymentIntent(event);

      expect(mockRepository.logPaymentIntent).toHaveBeenCalledWith(event);
    });
  });

  describe('logPaymentFailed', () => {
    it('should log payment failed event', async () => {
      const event: PaymentObjectEventDetail = {
        paymentIntentId: 'pi_123',
        amount: 1000,
        currency: 'gbp',
        created: new Date().getTime(),
        member: { id: 'member_123', brazeExternalId: 'braze_123' },
        paymentMethodId: 'pm_123',
        metadata: {
          test: 'test',
        },
      };

      await loggingService.logPaymentFailed(event);

      expect(mockRepository.logPaymentFailed).toHaveBeenCalledWith(event);
    });
  });

  describe('logPaymentSucceeded', () => {
    it('should log payment succeeded event', async () => {
      const event: PaymentObjectEventDetail = {
        paymentIntentId: 'pi_123',
        amount: 1000,
        currency: 'gbp',
        created: new Date().getTime(),
        member: { id: 'member_123', brazeExternalId: 'braze_123' },
        paymentMethodId: 'pm_123',
        metadata: {
          test: 'test',
        },
      };

      await loggingService.logPaymentSucceeded(event);

      expect(mockRepository.logPaymentSucceeded).toHaveBeenCalledWith(event);
    });
  });
});
