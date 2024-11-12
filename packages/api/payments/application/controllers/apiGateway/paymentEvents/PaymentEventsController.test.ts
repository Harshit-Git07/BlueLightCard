import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { IPaymentEventsService } from '@blc-mono/payments/application/services/paymentEvents/PaymentEventsService';

import { createTestLogger } from '../../../../libs/test/helpers/logger';

import { PaymentEventsController } from './PaymentEventsController';

describe('PaymentEventsController', () => {
  it('should return request validation error', async () => {
    // Arrange
    const logger = createTestLogger();
    const paymentEventsService = {
      getPaymentEvents: jest.fn(),
    } satisfies IPaymentEventsService;

    const request = {
      headers: {
        'x-client-type': 'web',
      },
      requestContext: {
        requestId: 'requestId',
      },
      queryStringParameters: {
        somethingElse: 'member_id',
      },
    };

    const controller = new PaymentEventsController(logger, paymentEventsService);

    // Act

    const response = await controller.invoke(request as unknown as APIGatewayProxyEventV2);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body!).error.cause).toContain('Request validation failed');
  });

  it('returns 200 and initiation data when handling was successful', async () => {
    // Arrange

    const logger = createTestLogger();
    const paymentEventsService = {
      getPaymentEvents: jest.fn(),
    } satisfies IPaymentEventsService;

    const request = {
      headers: {
        'x-client-type': 'web',
      },
      requestContext: {
        requestId: 'requestId',
      },
      queryStringParameters: {
        memberId: 'member_id',
      },
    };

    paymentEventsService.getPaymentEvents.mockResolvedValue([
      {
        eventType: 'some event',
      },
    ]);

    const controller = new PaymentEventsController(logger, paymentEventsService);

    // Act

    const response = await controller.invoke(request as unknown as APIGatewayProxyEventV2);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(paymentEventsService.getPaymentEvents).toHaveBeenCalledWith('member_id');
    const body = JSON.parse(response.body!);
    expect(body.data[0].eventType).toEqual('some event');
  });

  it('returns 500 with error message initiation fails', async () => {
    // Arrange

    const logger = createTestLogger();
    const paymentEventsService = {
      getPaymentEvents: jest.fn(),
    } satisfies IPaymentEventsService;

    const request = {
      headers: {
        'x-client-type': 'web',
      },
      requestContext: {
        requestId: 'requestId',
      },
      queryStringParameters: {
        memberId: 'member_id',
      },
    };

    paymentEventsService.getPaymentEvents.mockRejectedValue(new Error('Some error'));

    const controller = new PaymentEventsController(logger, paymentEventsService);

    // Act

    const response = await controller.invoke(request as unknown as APIGatewayProxyEventV2);

    // Assert
    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body!);
    expect(body.data.message).toEqual('Internal Server Error');
    expect(body.data.error).toEqual('Some error');
  });
});
