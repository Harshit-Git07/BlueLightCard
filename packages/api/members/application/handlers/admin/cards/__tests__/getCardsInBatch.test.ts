import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { CardService } from '@blc-mono/members/application/services/cardService';
import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer,
} from 'aws-lambda/common/api-gateway';
import { BatchedCardModel } from '@blc-mono/shared/models/members/cardModel';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';

jest.mock('@blc-mono/members/application/services/cardService');

describe('getCardsInBatch handler', () => {
  const batchNumber = uuidv4();
  const card: BatchedCardModel = {
    cardNumber: 'BLC012345',
    cardStatus: CardStatus.PHYSICAL_CARD,
    createdDate: '2023-01-01T00:00:00.000Z',
    nameOnCard: 'John Doe',
    printedDate: '2023-01-01T00:00:00.000Z',
    postedDate: '2023-01-01T00:00:00.000Z',
  };
  const cards: BatchedCardModel[] = [card];
  const event: APIGatewayProxyEvent = {
    pathParameters: { batchNumber },
    body: null,
    headers: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    queryStringParameters: null,
    requestContext:
      {} as unknown as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>,
    resource: '',
    stageVariables: null,
    path: '',
  };
  const context = {} as Context;

  beforeEach(() => {
    CardService.prototype.getCardsInBatch = jest.fn().mockResolvedValue(cards);
  });

  it('should return 400 if batchNumber is missing', async () => {
    const eventWithMissingBatchNumber = {
      ...event,
      pathParameters: {},
    };

    const response = await handler(eventWithMissingBatchNumber, context);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with cards on successful retrieval', async () => {
    const response = await handler(event, context);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(cards);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return await (await import('../getCardsInBatch')).handler(event, context);
}
