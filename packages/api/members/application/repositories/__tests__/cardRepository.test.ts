import {
  DynamoDBDocumentClient,
  UpdateCommand,
  QueryCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { CardRepository } from '../cardRepository';
import { CardModel } from '../../models/cardModel';
import { NotFoundError } from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { cardKey, memberKey } from '../repository';
import { CardStatus } from '../../models/enums/CardStatus';
import { PaymentStatus } from '../../models/enums/PaymentStatus';

jest.mock('@aws-sdk/lib-dynamodb');

const memberId = uuidv4();
const cardNumber = 'BLC123456789';
const card: CardModel = {
  memberId: memberId,
  cardNumber: cardNumber,
  nameOnCard: 'John Doe',
  cardStatus: CardStatus.PHYSICAL_CARD,
  expiryDate: '2023-12-31T23:59:59Z',
  postedDate: '2023-01-01T00:00:00Z',
  purchaseTime: '2023-01-01T00:00:00Z',
  paymentStatus: PaymentStatus.PAID_CARD,
};

let repository: CardRepository;
let dynamoDBMock = {
  send: jest.fn(),
};
const updateCommandMock = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;

describe('CardRepository', () => {
  beforeEach(() => {
    repository = new CardRepository(
      dynamoDBMock as any as DynamoDBDocumentClient,
      'memberProfiles',
    );
  });

  describe('getCards', () => {
    it('should return an empty array if no cards are found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Items: [] });
      const result = await repository.getCards(memberId);
      expect(result).toEqual([]);
    });

    it('should return cards for the member', async () => {
      const items = [card];
      dynamoDBMock.send.mockResolvedValue({ Items: items });
      const result = await repository.getCards(memberId);
      expect(result).toEqual(items.map((item) => CardModel.parse(item)));
    });
  });

  describe('getCard', () => {
    it('should throw NotFoundError if card is not found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Item: null });
      await expect(repository.getCard(memberId, cardNumber)).rejects.toThrow(NotFoundError);
    });

    it('should return the card if found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Item: card });
      const result = await repository.getCard(memberId, cardNumber);
      expect(result).toEqual(CardModel.parse(card));
    });
  });

  describe('upsertCard', () => {
    it('should insert a new card', async () => {
      dynamoDBMock.send.mockResolvedValue({});
      const result = await repository.upsertCard({
        memberId: memberId,
        cardNumber: cardNumber,
        card: card,
        isInsert: true,
      });

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Key: {
          pk: memberKey(memberId),
          sk: cardKey(cardNumber),
        },
        ConditionExpression: '',
        UpdateExpression:
          'SET memberId = :memberId, cardNumber = :cardNumber, memberId = :memberId, cardNumber = :cardNumber, nameOnCard = :nameOnCard, cardStatus = :cardStatus, expiryDate = :expiryDate, postedDate = :postedDate, purchaseTime = :purchaseTime, paymentStatus = :paymentStatus ',
        ExpressionAttributeValues: {
          ':memberId': memberId,
          ':cardNumber': cardNumber,
          ':nameOnCard': 'John Doe',
          ':cardStatus': 'PHYSICAL_CARD',
          ':expiryDate': '2023-12-31T23:59:59Z',
          ':postedDate': '2023-01-01T00:00:00Z',
          ':purchaseTime': '2023-01-01T00:00:00Z',
          ':paymentStatus': 'PAID_CARD',
          ':pk': memberKey(memberId),
          ':sk': cardKey(cardNumber),
        },
      });
    });

    it('should update an existing card', async () => {
      dynamoDBMock.send.mockResolvedValue({});
      const result = await repository.upsertCard({
        memberId: memberId,
        cardNumber: cardNumber,
        card: card,
      });

      expect(result).toBeUndefined();
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Key: {
          pk: memberKey(memberId),
          sk: cardKey(cardNumber),
        },
        ConditionExpression: 'pk = :pk AND sk = :sk',
        UpdateExpression:
          'SET memberId = :memberId, cardNumber = :cardNumber, memberId = :memberId, cardNumber = :cardNumber, nameOnCard = :nameOnCard, cardStatus = :cardStatus, expiryDate = :expiryDate, postedDate = :postedDate, purchaseTime = :purchaseTime, paymentStatus = :paymentStatus ',
        ExpressionAttributeValues: {
          ':memberId': memberId,
          ':cardNumber': cardNumber,
          ':nameOnCard': 'John Doe',
          ':cardStatus': 'PHYSICAL_CARD',
          ':expiryDate': '2023-12-31T23:59:59Z',
          ':postedDate': '2023-01-01T00:00:00Z',
          ':purchaseTime': '2023-01-01T00:00:00Z',
          ':paymentStatus': 'PAID_CARD',
          ':pk': memberKey(memberId),
          ':sk': cardKey(cardNumber),
        },
      });
    });
  });
});
