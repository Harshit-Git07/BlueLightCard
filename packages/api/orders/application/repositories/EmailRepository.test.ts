import * as process from 'process';

import { OrdersStackEnvironmentKeys } from '@blc-mono/orders/infrastructure/constants/environment';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { EmailRepository } from './EmailRepository';

describe('EmailRepository', () => {
  beforeEach(() => {
    process.env[OrdersStackEnvironmentKeys.CURRENCY_CODE] = 'gbp';
    process.env[OrdersStackEnvironmentKeys.BRAZE_PAYMENT_SUCCEEDED_EMAIL_CAMPAIGN_ID] = 'test';
    process.env[OrdersStackEnvironmentKeys.BRAZE_API_URL] = 'braze';
  });

  afterEach(() => {
    delete process.env[OrdersStackEnvironmentKeys.CURRENCY_CODE];
    delete process.env[OrdersStackEnvironmentKeys.BRAZE_PAYMENT_SUCCEEDED_EMAIL_CAMPAIGN_ID];
    delete process.env[OrdersStackEnvironmentKeys.BRAZE_API_URL];
  });

  describe('EmailRepository', () => {
    it('should send an payment succeeded email with the braze email client', async () => {
      const logger = createTestLogger();

      const mockSend = jest.fn().mockResolvedValue({ message: 'success' });

      const mockBrazeClientProvider = {
        getClient: jest.fn().mockResolvedValue({
          campaigns: {
            list: jest.fn(),
            trigger: {
              send: mockSend,
              schedule: {
                create: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
              },
            },
          },
        }),
      };

      const repository = new EmailRepository(logger, mockBrazeClientProvider);

      // Act
      await repository.sendPaymentSucceededEmail({
        member: {
          id: '123',
          brazeExternalId: '456',
        },
        amount: 499,
      });

      // Assert
      expect(mockSend).toHaveBeenCalledWith({
        campaign_id: 'test',
        recipients: [
          {
            external_user_id: '456',
          },
        ],
        trigger_properties: {
          amount: '4.99',
          currency_symbol: '£',
        },
      });
    });

    it('should throw when payment succeeded email fails', async () => {
      const logger = createTestLogger();

      const mockSend = jest.fn().mockResolvedValue({ message: 'failed' });

      const mockBrazeClientProvider = {
        getClient: jest.fn().mockResolvedValue({
          campaigns: {
            list: jest.fn(),
            trigger: {
              send: mockSend,
              schedule: {
                create: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
              },
            },
          },
        }),
      };

      const repository = new EmailRepository(logger, mockBrazeClientProvider);

      const act = () =>
        repository.sendPaymentSucceededEmail({
          member: {
            id: '123',
            brazeExternalId: '456',
          },
          amount: 499,
        });

      // Assert
      await expect(act).rejects.toThrow();
    });
  });
});
