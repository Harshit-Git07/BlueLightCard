import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
// import { faker } from '@faker-js/faker';
import { mockClient } from 'aws-sdk-client-mock';

import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

import { DwhRepository } from './DwhRepository';

jest.useFakeTimers({
  now: new Date('2021-09-01T00:00:00.000Z'),
});

describe('DwhRepository', () => {
  const mockFirehoseClient = mockClient(FirehoseClient);

  afterEach(() => {
    mockFirehoseClient.reset();
    delete process.env[PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME];
  });

  describe('logPaymentIntent', () => {
    it('should send the correct data to the payment stream', async () => {
      // Arrange
      process.env[PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME] = 'firehose-payments';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      const dto: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: Date.now(),
        metadata: { something: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      };

      // Act
      await dwhRepository.logPaymentIntent(dto);

      // // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('firehose-payments');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data);

      expect(JSON.parse(data)).toStrictEqual({
        currency: dto.currency,
        payment_intent_id: dto.paymentIntentId,
        amount: dto.amount,
        event_time: new Date(dto.created).toISOString(),
        member_id: dto.member?.id,
        event_type: 'payment_intent',
      });
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach stream', async () => {
      process.env[PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME] = 'firehose-redemptions';
      const dwhRepository = new DwhRepository();
      // const companyId = faker.string.uuid();

      const dto: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: Date.now(),
        metadata: { something: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      };

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logPaymentIntent(dto);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logPaymentFailed', () => {
    it('should send the correct data to the payment stream', async () => {
      // Arrange
      process.env[PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME] = 'firehose-payments';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      const dto: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: Date.now(),
        metadata: { something: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      };

      // Act
      await dwhRepository.logPaymentFailed(dto);

      // // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('firehose-payments');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data);

      expect(JSON.parse(data)).toStrictEqual({
        currency: dto.currency,
        payment_method_id: dto.paymentMethodId,
        payment_intent_id: dto.paymentIntentId,
        amount: dto.amount,
        event_time: new Date(dto.created).toISOString(),
        member_id: dto.member?.id,
        event_type: 'payment_failed',
      });
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach stream', async () => {
      process.env[PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME] = 'firehose-redemptions';
      const dwhRepository = new DwhRepository();
      // const companyId = faker.string.uuid();

      const dto: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: Date.now(),
        metadata: { something: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      };

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logPaymentFailed(dto);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logPaymentSucceeded', () => {
    it('should send the correct data to the payment stream', async () => {
      // Arrange
      process.env[PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME] = 'firehose-payments';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      const dto: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: Date.now(),
        metadata: { something: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      };

      // Act
      await dwhRepository.logPaymentSucceeded(dto);

      // // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('firehose-payments');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data);

      expect(JSON.parse(data)).toStrictEqual({
        currency: dto.currency,
        payment_method_id: dto.paymentMethodId,
        payment_intent_id: dto.paymentIntentId,
        amount: dto.amount,
        event_time: new Date(dto.created).toISOString(),
        member_id: dto.member?.id,
        event_type: 'payment_succeeded',
      });
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach stream', async () => {
      process.env[PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME] = 'firehose-redemptions';
      const dwhRepository = new DwhRepository();
      // const companyId = faker.string.uuid();

      const dto: PaymentObjectEventDetail = {
        currency: 'gbp',
        paymentIntentId: 'pi_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        created: Date.now(),
        metadata: { something: '1234567890' },
        amount: 499,
        paymentMethodId: 'pm_1JZ6Zz2eZvKYlo2C5J9J9J9J',
        member: { id: '1234567890', brazeExternalId: '' },
      };

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logPaymentSucceeded(dto);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });
});
