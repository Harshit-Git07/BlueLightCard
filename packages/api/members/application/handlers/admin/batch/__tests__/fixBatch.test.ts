import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { BatchService } from '@blc-mono/members/application/services/batchService';

describe('fixBatch handler', () => {
  const batchId = uuidv4();
  const event = { pathParameters: { batchId: batchId } } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    BatchService.prototype.fixBatch = jest.fn();
  });

  it('should return 400 if batchId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(event, context);
    expect(BatchService.prototype.fixBatch).toHaveBeenCalled();
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../fixBatch')).handler(event, context);
}
