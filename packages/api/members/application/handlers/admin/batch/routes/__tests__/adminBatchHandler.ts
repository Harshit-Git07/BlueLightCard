import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { CreateInternalBatchModelResponse } from '@blc-mono/shared/models/members/batchModel';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('createInternalBatch handler', () => {
  const event = {
    body: JSON.stringify([{ name: 'name', cards: ['card1', 'card2'] }]),
  } as unknown as APIGatewayProxyEvent;
  const batchCreated: CreateInternalBatchModelResponse = {
    batchId: uuidv4(),
  };

  beforeEach(() => {
    BatchService.prototype.createInternalBatch = jest.fn().mockResolvedValue(batchCreated);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with batch ID on successful creation', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(batchCreated);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../adminBatchHandler')).handler(event, emptyContextStub);
}
