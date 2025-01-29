import { APIGatewayProxyEvent } from 'aws-lambda';

export function isPaymentHistoryEvent(event: APIGatewayProxyEvent): boolean {
  return (
    event.pathParameters !== null &&
    event.pathParameters.memberId !== undefined &&
    event.path === `/admin/payments/history/${event.pathParameters.memberId}`
  );
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function paymentHistoryHandler(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}
