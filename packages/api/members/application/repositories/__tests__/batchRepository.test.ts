import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { BatchRepository } from '@blc-mono/members/application/repositories/batchRepository';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateBatchModel,
  UpdateBatchModel,
} from '@blc-mono/members/application/models/batchModel';
import { BatchType } from '@blc-mono/members/application/models/enums/BatchType';
import { BATCH, batchKey, cardKey } from '@blc-mono/members/application/repositories/repository';
import { BatchStatus } from '@blc-mono/members/application/models/enums/BatchStatus';
import { BatchEntryModel } from '@blc-mono/members/application/models/batchEntryModel';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const batchId = '6c5d61ad-a2d7-4153-9041-28cc1452a44a';

let repository: BatchRepository;
let dynamoDBMock = {
  send: jest.fn(),
};
const putCommandMock = PutCommand as jest.MockedClass<typeof PutCommand>;
const updateCommandMock = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;

describe('BatchRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
    repository = new BatchRepository(dynamoDBMock as any as DynamoDBDocumentClient, 'memberAdmin');
  });

  describe('createBatch', () => {
    it('should create a new batch', async () => {
      (uuidv4 as jest.Mock).mockReturnValue(batchId);
      dynamoDBMock.send.mockResolvedValue({});
      const createBatchModel: CreateBatchModel = {
        name: 'batchName',
        type: BatchType.EXTERNAL,
        count: 500,
      };

      const result = await repository.createBatch(createBatchModel);

      expect(result).toBe(batchId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        Item: {
          pk: batchKey(batchId),
          sk: BATCH,
          batchId: batchId,
          name: 'batchName',
          type: BatchType.EXTERNAL,
          count: 500,
          createdDate: '2023-01-01T00:00:00.000Z',
          status: BatchStatus.BATCH_OPEN,
        },
        TableName: 'memberAdmin',
      });
    });
  });

  describe('createBatchEntry', () => {
    it('should create a new batch entry', async () => {
      const memberId = '318ae9fe-df1c-4ebe-8416-4f2cae0062b1';
      const applicationId = '1602cd27-7cf1-470b-a74b-4731ccecac30';

      dynamoDBMock.send.mockResolvedValue({});
      const batchEntryModel: BatchEntryModel = {
        batchId: batchId,
        cardNumber: 'BLC034545',
        memberId: memberId,
        applicationId: applicationId,
      };

      const result = await repository.createBatchEntry(batchEntryModel);

      expect(result).toBe(batchId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        Item: {
          pk: batchKey(batchEntryModel.batchId),
          sk: cardKey(batchEntryModel.cardNumber),
          batchId: batchId,
          cardNumber: 'BLC034545',
          memberId: memberId,
          applicationId: applicationId,
        },
        TableName: 'memberAdmin',
      });
    });
  });

  describe('updateBatch', () => {
    it('should update an existing batch', async () => {
      const updateBatchModel: UpdateBatchModel = {
        sentDate: '2023-01-01T00:00:00.000Z',
      };
      dynamoDBMock.send.mockResolvedValue({});
      await repository.updateBatch(batchId, updateBatchModel);

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberAdmin',
        Key: {
          pk: batchKey(batchId),
          sk: BATCH,
        },
        ExpressionAttributeNames: {
          '#sentDate': 'sentDate',
        },
        ExpressionAttributeValues: {
          ':sentDate': '2023-01-01T00:00:00.000Z',
        },
        UpdateExpression: 'SET #sentDate = :sentDate ',
      });
    });
  });
});
