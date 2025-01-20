import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  if (event.path === '/admin/payments/initiate') {
    return initiatePayment(event);
  }
  if (event.path === '/admin/payments/checkout') {
    return completePayment(event);
  }
  if (
    event.pathParameters &&
    event.pathParameters.transactionId &&
    event.path === `/admin/payments/refund/${event.pathParameters.transactionId}`
  ) {
    return refundPayment(event);
  }
  if (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path === `/admin/payments/history/${event.pathParameters.memberId}`
  ) {
    return paymentHistory(event);
  }
};

function initiatePayment(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

function completePayment(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

function refundPayment(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

function paymentHistory(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

export const handler = middleware(unwrappedHandler);
