import { APIGatewayProxyEvent } from 'aws-lambda';

export function isUpdateCardPrintBatchRoute(event: APIGatewayProxyEvent): boolean {
  return (
    event.httpMethod === 'PUT' &&
    event.pathParameters !== null &&
    event.pathParameters.batchId !== undefined &&
    event.path === `/admin/cards/batches/${event.pathParameters.batchId}`
  );
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateCardPrintBatchHandler(event: APIGatewayProxyEvent): Promise<void> {
  // TODO: Implement handler
}
