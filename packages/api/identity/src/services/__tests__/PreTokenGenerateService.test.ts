import { UserRepository } from 'src/repositories/userRepository';
import { PreTokenGenerateService } from '../PreTokenGenerateService';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { CardStatus } from '@blc-mono/core/types/cardStatus.enum';
import { Logger } from '@aws-lambda-powertools/logger';

describe('PreTokenGenerateService', () => {
  let preTokenGenerateService: PreTokenGenerateService;
  let userRepository: UserRepository;
  const MOCK_MEMBER_ID: string = '068385bb-b370-4153-9474-51dd0bfac9dc';
  let dynamoMock: ReturnType<typeof mockClient>;

  beforeEach(() => {
    userRepository = new UserRepository('mockTableName', 'mockRegion');
    preTokenGenerateService = new PreTokenGenerateService('mockTableName', 'mockRegion', new Logger());
    preTokenGenerateService.userRepository = userRepository;

    dynamoMock = mockClient(DynamoDBDocumentClient);
    dynamoMock.on(QueryCommand).resolves({
      Items: [
        {
          sk: 'CARD#0000005',
          expires: '1758365897',
          pk: `MEMBER#${MOCK_MEMBER_ID}`,
          posted: '1695220641',
          status: CardStatus.CARD_EXPIRED,
        },
        {
          sk: 'CARD#0000009',
          expires: '1758365897',
          pk: `MEMBER#${MOCK_MEMBER_ID}`,
          posted: '1695220641',
          status: CardStatus.AWAITING_ID_APPROVAL,
        },
        {
          sk: 'CARD#0000001',
          expires: '1758365897',
          pk: `MEMBER#${MOCK_MEMBER_ID}`,
          posted: '1695220641',
          status: CardStatus.ID_APPROVED,
        },
      ],
    });
  });

  test('should find the latest card status', async () => {
    const latestCardStatus = await preTokenGenerateService.findLatestCardStatus(MOCK_MEMBER_ID);
    expect(latestCardStatus).toBe(CardStatus.AWAITING_ID_APPROVAL);
  });

  test('should throw an error when fetching data from DB fails', async () => {
    userRepository.findItemsByUuid = jest.fn().mockRejectedValue(new Error('DB error'));
    await expect(preTokenGenerateService.findLatestCardStatus(MOCK_MEMBER_ID)).rejects.toStrictEqual(
      new Error('error while fetching data from DB'),
    );
  });

  test('Test DB fails when returned card data is empty', async () => {
    dynamoMock.on(QueryCommand).resolves({
      Items: [],
    });
    userRepository.findItemsByUuid = jest.fn().mockRejectedValue(new Error('DB error'));
    await expect(preTokenGenerateService.findLatestCardStatus(MOCK_MEMBER_ID)).rejects.toStrictEqual(
      new Error('error while fetching data from DB'),
    );
  });

  test('Test returned Card status is empty when Card details are missing in DB', async () => {
    dynamoMock.on(QueryCommand).resolves({
      Items: [
        {
          sk: 'BRAND#BLC_UK',
          legacy_id: '2853201',
          pk: `MEMBER#${MOCK_MEMBER_ID}`,
        },
        {
          pk: `MEMBER#${MOCK_MEMBER_ID}`,
          sk: 'PROFILE#77e83fa1-36f6-4da2-8561-98681588b52d',
          spare_email: 'rlimbu+work1@bluelightcard.co.uk',
          merged_uid: false,
          employer_id: '0',
          organisation: 'AMBU',
        },
      ],
    });
    const latestCardStatus = await preTokenGenerateService.findLatestCardStatus(MOCK_MEMBER_ID);
    expect(latestCardStatus).toBe('');
  });
});
