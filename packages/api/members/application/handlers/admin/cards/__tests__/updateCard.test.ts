import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCardModel } from '@blc-mono/members/application/models/cardModel';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { CardStatus } from '@blc-mono/members/application/models/enums/CardStatus';

jest.mock('@blc-mono/members/application/services/cardService');

describe('updateCard handler', () => {
  const memberId = uuidv4();
  const cardNumber = 'BLC123456789';
  const card: UpdateCardModel = {
    cardStatus: CardStatus.AWAITING_POSTAGE,
  };
  const event = {
    pathParameters: { memberId, cardNumber },
    body: JSON.stringify(card),
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    CardService.prototype.updateCard = jest.fn().mockResolvedValue(undefined);
  });

  it('should return 400 if memberId or cardNumber is missing', async () => {
    const event = { pathParameters: {} } as any as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { pathParameters: { memberId, cardNumber } } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  return (await import('../updateCard')).handler(event, context);
}
