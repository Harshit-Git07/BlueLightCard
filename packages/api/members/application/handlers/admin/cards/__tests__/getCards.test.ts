import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/cardService');

describe('getCards handler', () => {
  const memberId = uuidv4();
  const card: CardModel = {
    cardNumber: 'BLC012345',
    cardStatus: CardStatus.PHYSICAL_CARD,
    createdDate: '2023-01-01T00:00:00.000Z',
    nameOnCard: 'John Doe',
    purchaseDate: '2023-01-01T00:00:00.000Z',
    memberId,
    expiryDate: '2024-01-01',
  };
  const cards: CardModel[] = [card];
  const event = { pathParameters: { memberId } } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    CardService.prototype.getCards = jest.fn().mockResolvedValue(cards);
  });

  it('should return 400 if memberId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with cards on successful retrieval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);

    expect(JSON.parse(response.body)).toEqual(cards);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../getCards')).handler(event, emptyContextStub);
}
