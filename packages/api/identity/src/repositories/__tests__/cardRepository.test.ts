import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';  // Import necessary AWS SDK modules
import { mockClient } from 'aws-sdk-client-mock';  // Import the mockClient function
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';  // Needed for initializing the mock
import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { CardRepository } from '../cardRepository';

const dynamoMock = mockClient(DynamoDBDocumentClient);

describe('CardRepository', () => {
  let cardRepository: CardRepository;

  beforeEach(() => {
    cardRepository = new CardRepository('TestTable', 'eu-west-2');
    dynamoMock.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserCurrentCard', () => {
    it('should call DynamoDB QueryCommand with correct parameters', async () => {
      const mockResponse = { Items: [], Count: 0 };
      dynamoMock.on(QueryCommand).resolves(mockResponse);

      const uuid = '123';
      const legacyCardId = '456';
      await cardRepository.getUserCurrentCard(uuid, legacyCardId);

      expect(dynamoMock.calls()).toHaveLength(1);
      expect(dynamoMock.calls()[0].args[0].input).toEqual({
        TableName: 'TestTable',
        KeyConditionExpression: '#pk= :pk And #sk = :sk',
        ExpressionAttributeValues: {
          ':pk': `MEMBER#${uuid}`,
          ':sk': `CARD#${legacyCardId}`,
        },
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
      });
    });

    it('should return the result from DynamoDB', async () => {
      const mockResponse = { Items: [{ uuid: '123', legacyCardId: '456' }], Count: 1 };
      dynamoMock.on(QueryCommand).resolves(mockResponse);

      const result = await cardRepository.getUserCurrentCard('123', '456');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateUsersCard', () => {
    it('should call PutCommand with the correct parameters when previous data is empty', async () => {
      const mockResponse = { $metadata: {}, Items: [], Count: 0 };
      dynamoMock.on(PutCommand).resolves(mockResponse);

      const previousCard: QueryCommandOutput = { $metadata: {}, Items: [], Count: 0 };
      const newExpiry = '2024-09-10 10:00:00';
      const newPosted = '2024-09-11 10:00:00';
      const uuid = '123';
      const legacyCardId = '456';
      const cardStatus = '1';

      await cardRepository.updateUsersCard(previousCard, newExpiry, newPosted, uuid, legacyCardId, cardStatus);

      expect(dynamoMock.calls()).toHaveLength(1);
      expect(dynamoMock.calls()[0].args[0].input).toEqual({
        Item: {
          pk: `MEMBER#${uuid}`,
          sk: `CARD#${legacyCardId}`,
          status: 'AWAITING_ID',
          expires: expect.any(String),
          posted: expect.any(String),
        },
        TableName: 'TestTable',
      });
    });

    it('should update Item correctly when previous data exists', async () => {
      dynamoMock.on(PutCommand).resolves({});

      const previousCard: QueryCommandOutput = {
        $metadata: {},
        Items: [{ expires: '0000-00-00 00:00:00', posted: String(new Date('2024-09-10 10:00:00'.toString()).getTime()) }],
        Count: 1,
      };
      const newExpiry = '2024-09-12 10:00:00';
      const newPosted = '2024-09-13 10:00:00';
      const uuid = '123';
      const legacyCardId = '456';
      const cardStatus = '1';

      await cardRepository.updateUsersCard(previousCard, newExpiry, newPosted, uuid, legacyCardId, cardStatus);

      expect(dynamoMock.calls()).toHaveLength(1);
      expect(dynamoMock.calls()[0].args[0].input).toEqual({
        Item: {
          pk: `MEMBER#${uuid}`,
          sk: `CARD#${legacyCardId}`,
          status: 'AWAITING_ID',
          expires: String(new Date(newExpiry.toString()).getTime()),  // Based on setDate and logic
          posted: String(new Date('2024-09-10 10:00:00'.toString()).getTime()),
        },
        TableName: 'TestTable',
      });
    });
  });
});
