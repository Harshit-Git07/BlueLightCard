import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/cardService');

describe('getCard handler', () => {
  const memberId = uuidv4();
  const cardNumber = 'BLC123456789';
  const card: CardModel = {
    cardStatus: CardStatus.PHYSICAL_CARD,
    createdDate: '2023-01-01T00:00:00.000Z',
    nameOnCard: 'John Doe',
    purchaseDate: '2023-01-01T00:00:00.000Z',
    memberId,
    cardNumber,
    expiryDate: '2024-01-01',
  };
  const event = {
    pathParameters: { memberId, cardNumber },
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    CardService.prototype.getCard = jest.fn().mockResolvedValue(card);
  });

  it('should return 400 if memberId or cardNumber is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with card on successful retrieval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(card);
  });
});

async function handler(event: APIGatewayProxyEvent) {
  return await (await import('../getCard')).handler(event, emptyContextStub);
}
