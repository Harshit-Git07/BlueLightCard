import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { CardService } from '@blc-mono/members/application/services/cardService';

jest.mock('@blc-mono/members/application/services/cardService');

describe('getCard handler', () => {
  const memberId = uuidv4();
  const cardNumber = 'BLC123456789';
  const card: CardModel = { memberId, cardNumber, expiryDate: '2024-01-01' };
  const event = {
    pathParameters: { memberId, cardNumber },
  } as any as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    CardService.prototype.getCard = jest.fn().mockResolvedValue(card);
  });

  it('should return 400 if memberId or cardNumber is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with card on successful retrieval', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(card);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../getCard')).handler(event, context);
}
