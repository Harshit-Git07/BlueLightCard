import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { IPaymentInitiationService } from '@blc-mono/payments/application/services/paymentInitiation/PaymentInitiationService';

import { createTestLogger } from '../../../../libs/test/helpers/logger';

import { PaymentInitiationController } from './PaymentInitiationController';

describe('PaymentInitiationController', () => {
  it('should return request validation error', async () => {
    // Arrange
    const logger = createTestLogger();
    const paymentInitiationService = {
      InitiatePayment: jest.fn(),
    } satisfies IPaymentInitiationService;

    const request = {
      body: JSON.stringify({
        idempotencyKey: '12345',
        user: { memberId: '123' },
        amount: 100,
        metadata: {},
        description: 'Test payment',
      }),
      headers: {
        'x-client-type': 'web',
      },
      requestContext: {
        requestId: 'requestId',
      },
    };

    const controller = new PaymentInitiationController(logger, paymentInitiationService);

    // Act

    const response = await controller.invoke(request as unknown as APIGatewayProxyEventV2);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body!).error.cause).toContain('Request validation failed');
  });

  it('returns 200 and initiation data when handling was successful', async () => {
    // Arrange

    const logger = createTestLogger();
    const paymentInitiationService = {
      InitiatePayment: jest.fn(),
    } satisfies IPaymentInitiationService;

    const request = {
      body: JSON.stringify({
        idempotencyKey: '12345',
        user: {
          memberId: '123',
          brazeExternalId: '1e33',
          name: 'some name',
        },
        amount: 100,
        metadata: {},
        description: 'Test payment',
      }),
      headers: {
        'x-client-type': 'web',
      },
      requestContext: {
        requestId: 'requestId',
      },
    };

    paymentInitiationService.InitiatePayment.mockResolvedValue({
      paymentIntentId: 'paymentIntentId',
      clientSecret: 'clientSecret',
      publishableKey: 'publishableKey',
      ephemeralKey: 'ephemeralKey',
      externalCustomer: 'externalCustomer',
    });

    const controller = new PaymentInitiationController(logger, paymentInitiationService);

    // Act

    const response = await controller.invoke(request as unknown as APIGatewayProxyEventV2);

    // Assert
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body!);
    expect(body.data.paymentIntentId).toEqual('paymentIntentId');
    expect(body.data.clientSecret).toEqual('clientSecret');
    expect(body.data.publishableKey).toEqual('publishableKey');
    expect(body.data.externalCustomer).toEqual('externalCustomer');
  });

  it('returns 500 with error message initiation fails', async () => {
    // Arrange

    const logger = createTestLogger();
    const paymentInitiationService = {
      InitiatePayment: jest.fn(),
    } satisfies IPaymentInitiationService;

    const request = {
      body: JSON.stringify({
        idempotencyKey: '12345',
        user: {
          memberId: '123',
          brazeExternalId: '1e33',
          name: 'some name',
        },
        amount: 100,
        metadata: {},
        description: 'Test payment',
      }),
      headers: {
        'x-client-type': 'web',
      },
      requestContext: {
        requestId: 'requestId',
      },
    };

    paymentInitiationService.InitiatePayment.mockRejectedValue(new Error('Some error'));

    const controller = new PaymentInitiationController(logger, paymentInitiationService);

    // Act

    const response = await controller.invoke(request as unknown as APIGatewayProxyEventV2);

    // Assert
    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body!);
    expect(body.data.message).toEqual('Internal Server Error');
    expect(body.data.error).toEqual('Some error');
  });
});
