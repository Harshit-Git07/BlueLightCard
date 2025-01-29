import { APIGatewayProxyEvent } from 'aws-lambda';

export function isRefundPaymentEvent(event: APIGatewayProxyEvent): boolean {
  return (
    event.pathParameters !== null &&
    event.pathParameters.transactionId !== undefined &&
    event.path === `/admin/payments/refund/${event.pathParameters.transactionId}`
  );
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function refundPaymentHandler(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}
