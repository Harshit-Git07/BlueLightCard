import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { CardService } from '@blc-mono/members/application/services/cardService';
import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer,
} from 'aws-lambda/common/api-gateway';
import { AwaitingBatchingCardModel } from '@blc-mono/shared/models/members/cardModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/cardService');

describe('getCardsAwaitingBatching handler', () => {
  const memberId = uuidv4();
  const card: AwaitingBatchingCardModel = {
    cardNumber: 'BLC012345',
    createdDate: '2023-01-01T00:00:00.000Z',
    nameOnCard: 'John Doe',
    purchaseDate: '2023-01-01T00:00:00.000Z',
    printingErrorStatus: undefined,
  };
  const cards: AwaitingBatchingCardModel[] = [card];
  const event: APIGatewayProxyEvent = {
    pathParameters: { memberId },
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

  beforeEach(() => {
    CardService.prototype.getCardsAwaitingBatching = jest.fn().mockResolvedValue(cards);
  });

  it('should return 200 with cards on successful retrieval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(cards);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../getCardsAwaitingBatching')).handler(event, emptyContextStub);
}
