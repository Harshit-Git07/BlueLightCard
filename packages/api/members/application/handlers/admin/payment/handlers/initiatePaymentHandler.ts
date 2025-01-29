import { APIGatewayProxyEvent } from 'aws-lambda';

export function isInitiatePaymentEvent(event: APIGatewayProxyEvent): boolean {
  return event.path === '/admin/payments/initiate';
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function initiatePaymentHandler(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}
