import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (isInitiatePaymentEvent(event)) {
    return initiatePayment(event);
  }

  if (isCompletePaymentEvent(event)) {
    return completePayment(event);
  }

  if (isRefundPaymentEvent(event)) {
    return refundPayment(event);
  }

  if (isPaymentHistoryEvent(event)) {
    return paymentHistory(event);
  }
};

function isInitiatePaymentEvent(event: APIGatewayProxyEvent) {
  return event.path === '/admin/payments/initiate';
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function initiatePayment(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

function isCompletePaymentEvent(event: APIGatewayProxyEvent) {
  return event.path === '/admin/payments/checkout';
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function completePayment(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

function isRefundPaymentEvent(event: APIGatewayProxyEvent) {
  return (
    event.pathParameters &&
    event.pathParameters.transactionId &&
    event.path === `/admin/payments/refund/${event.pathParameters.transactionId}`
  );
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function refundPayment(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

function isPaymentHistoryEvent(event: APIGatewayProxyEvent) {
  return (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path === `/admin/payments/history/${event.pathParameters.memberId}`
  );
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function paymentHistory(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}

export const handler = middleware(unwrappedHandler);
