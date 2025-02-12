import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { CardRepository } from '../cardRepository';
import { BatchedCardModel, CardModel } from '@blc-mono/shared/models/members/cardModel';
import { NotFoundError } from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { cardKey, memberKey } from '../repository';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';

jest.mock('@aws-sdk/lib-dynamodb');

const memberId = uuidv4();
const batchNumber = uuidv4();
const cardNumber = 'BLC123456789';
const card: CardModel = {
  memberId: memberId,
  cardNumber: cardNumber,
  nameOnCard: 'John Doe',
  cardStatus: CardStatus.PHYSICAL_CARD,
  createdDate: '2023-01-01T00:00:00Z',
  expiryDate: '2023-12-31T23:59:59Z',
  postedDate: '2023-01-01T00:00:00Z',
  purchaseDate: '2023-01-01T00:00:00Z',
  paymentStatus: PaymentStatus.PAID_CARD,
};

let repository: CardRepository;
let dynamoDBMock = {
  send: jest.fn(),
};
const updateCommandMock = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;
const queryCommandMock = QueryCommand as jest.MockedClass<typeof QueryCommand>;

describe('CardRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
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

  describe('getCardsInBatch', () => {
    it('should return an empty array if no cards are found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Items: [] });

      const result = await repository.getCardsInBatch(batchNumber);

      expect(result).toEqual([]);
    });

    it('should return cards for the batch number', async () => {
      const items = [card];
      dynamoDBMock.send.mockResolvedValue({ Items: items });

      const result = await repository.getCardsInBatch(batchNumber);

      expect(result).toEqual(items.map((item) => BatchedCardModel.parse(item)));
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

  describe('getCardsWithStatus', () => {
    it('should return an empty array if no cards are found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Items: [] });

      const result = await repository.getCardsWithStatus(CardStatus.AWAITING_BATCHING);

      expect(result).toEqual([]);
    });

    it('should return cards with matching status', async () => {
      const items = [card];
      dynamoDBMock.send.mockResolvedValue({ Items: items });

      const result = await repository.getCardsWithStatus(CardStatus.AWAITING_BATCHING);

      expect(result).toEqual(items.map((item) => CardModel.parse(item)));
      expect(queryCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        IndexName: 'CardStatusIndex',
        KeyConditionExpression: 'cardStatus = :cardStatus',
        ExpressionAttributeValues: {
          ':cardStatus': CardStatus.AWAITING_BATCHING,
        },
      });
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

      expect(result).toBeUndefined();
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Key: {
          pk: memberKey(memberId),
          sk: cardKey(cardNumber),
        },
        ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)',
        UpdateExpression:
          'SET memberId = :memberId, cardNumber = :cardNumber, nameOnCard = :nameOnCard, cardStatus = :cardStatus, createdDate = :createdDate, expiryDate = :expiryDate, postedDate = :postedDate, purchaseDate = :purchaseDate, paymentStatus = :paymentStatus, lastUpdated = :lastUpdated ',
        ExpressionAttributeValues: {
          ':memberId': memberId,
          ':cardNumber': cardNumber,
          ':nameOnCard': 'John Doe',
          ':cardStatus': 'PHYSICAL_CARD',
          ':createdDate': '2023-01-01T00:00:00Z',
          ':expiryDate': '2023-12-31T23:59:59Z',
          ':lastUpdated': '2023-01-01T00:00:00.000Z',
          ':postedDate': '2023-01-01T00:00:00Z',
          ':purchaseDate': '2023-01-01T00:00:00Z',
          ':paymentStatus': 'PAID_CARD',
        },
      });
    });

    it('should update an existing card', async () => {
      dynamoDBMock.send.mockResolvedValue({});
      const result = await repository.upsertCard({
        memberId: memberId,
        cardNumber: cardNumber,
        card: card,
        isInsert: false,
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
          'SET memberId = :memberId, cardNumber = :cardNumber, nameOnCard = :nameOnCard, cardStatus = :cardStatus, createdDate = :createdDate, expiryDate = :expiryDate, postedDate = :postedDate, purchaseDate = :purchaseDate, paymentStatus = :paymentStatus, lastUpdated = :lastUpdated ',
        ExpressionAttributeValues: {
          ':memberId': memberId,
          ':cardNumber': cardNumber,
          ':nameOnCard': 'John Doe',
          ':cardStatus': 'PHYSICAL_CARD',
          ':createdDate': '2023-01-01T00:00:00Z',
          ':expiryDate': '2023-12-31T23:59:59Z',
          ':lastUpdated': '2023-01-01T00:00:00.000Z',
          ':postedDate': '2023-01-01T00:00:00Z',
          ':purchaseDate': '2023-01-01T00:00:00Z',
          ':paymentStatus': 'PAID_CARD',
          ':pk': memberKey(memberId),
          ':sk': cardKey(cardNumber),
        },
      });
    });
  });
});
