import { APIGatewayProxyEvent } from 'aws-lambda';

export function isCompletePaymentEvent(event: APIGatewayProxyEvent): boolean {
  return event.path === '/admin/payments/checkout';
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function completePaymentHandler(event: APIGatewayProxyEvent): void {
  // TODO: Implement handler
}
