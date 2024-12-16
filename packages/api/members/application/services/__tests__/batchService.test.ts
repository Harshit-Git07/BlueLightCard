import { BatchService } from '@blc-mono/members/application/services/batchService';
import { BatchRepository } from '@blc-mono/members/application/repositories/batchRepository';
import {
  CreateBatchModel,
  UpdateBatchModel,
} from '@blc-mono/members/application/models/batchModel';
import { BatchType } from '@blc-mono/members/application/models/enums/BatchType';
import { BatchEntryModel } from '@blc-mono/members/application/models/batchEntryModel';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { S3 } from 'aws-sdk';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { CardStatus } from '@blc-mono/members/application/models/enums/CardStatus';
import { PaymentStatus } from '@blc-mono/members/application/models/enums/PaymentStatus';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { ApplicationReason } from '@blc-mono/members/application/models/enums/ApplicationReason';
import { PrintingErrorStatus } from '@blc-mono/members/application/models/enums/PrintingErrorStatus';
import { getBrandFromEnv, isBlcUkBrand } from '@blc-mono/core/utils/checkBrand';
import { BLC_UK_BRAND } from '@blc-mono/core/constants/common';
import { S3EventRecord } from 'aws-lambda';
import { Client } from 'basic-ftp';
import { BatchStatus } from '@blc-mono/members/application/models/enums/BatchStatus';

jest.mock('../../repositories/batchRepository');
jest.mock('../profileService');
jest.mock('../cardService');
jest.mock('aws-sdk');
jest.mock('../../../../core/src/utils/checkBrand');
const isBlcUkBrandMock = jest.mocked(isBlcUkBrand);
const getBrandFromEnvMock = jest.mocked(getBrandFromEnv);

jest.mock('sst/node/bucket', () => ({
  Bucket: {
    batchFilesBucket: {
      bucketName: 'batchFileBucketMock',
    },
  },
}));

const batchId = 'e3090de9-2d05-4a1a-8cc8-379767f9b54e';
const cardNumber = 'BLC012345';
const memberId = 'db2714f4-84ca-4208-b382-8a7d53c4500f';
const applicationId = 'f7919781-a438-4a56-ab7a-ae291c36867d';

const createBatchModel: CreateBatchModel = {
  name: 'batchName',
  type: BatchType.EXTERNAL,
  count: 500,
};

const batchEntryModel: BatchEntryModel = {
  batchId: batchId,
  cardNumber: cardNumber,
  memberId: memberId,
  applicationId: applicationId,
};

const createCard = (overrides: Partial<CardModel> = {}): CardModel => ({
  memberId,
  cardNumber,
  nameOnCard: 'John Doe',
  cardStatus: CardStatus.AWAITING_BATCHING,
  createdDate: '2023-01-01T00:00:00Z',
  expiryDate: '2023-12-31T23:59:59Z',
  postedDate: '2023-01-01T00:00:00Z',
  purchaseDate: '2023-01-01T00:00:00Z',
  paymentStatus: PaymentStatus.PAID_CARD,
  ...overrides,
});

const application: ApplicationModel = {
  memberId,
  applicationId,
  applicationReason: ApplicationReason.SIGNUP,
  cardNumber: cardNumber,
  address1: 'Example St',
  city: 'City',
  postcode: 'PT1 4RF',
  country: 'United Kingdom',
};

const profile: ProfileModel = {
  memberId,
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  email: 'john.doe@example.com',
  county: 'Essex',
  applications: [application],
};

let batchService: BatchService;
let repositoryMock: jest.Mocked<BatchRepository>;
let profileServiceMock: jest.Mocked<ProfileService>;
let cardServiceMock: jest.Mocked<CardService>;
let s3ClientMock: jest.Mocked<S3>;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2023, 0, 1));

  repositoryMock = new BatchRepository() as jest.Mocked<BatchRepository>;
  profileServiceMock = new ProfileService() as jest.Mocked<ProfileService>;
  cardServiceMock = new CardService() as jest.Mocked<CardService>;
  s3ClientMock = new S3() as jest.Mocked<S3>;

  S3.prototype.upload = jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue('Upload Complete'),
  }));

  batchService = new BatchService(
    repositoryMock as BatchRepository,
    cardServiceMock as CardService,
    profileServiceMock as ProfileService,
    s3ClientMock as S3,
  );
});

describe('BatchService', () => {
  const bucketName = 'batchFileBucketMock';
  const key = `blc-uk/outbound/${batchId}.csv`;
  const record = {
    s3: {
      bucket: {
        name: bucketName,
      },
      object: {
        key: key,
      },
    },
  } as S3EventRecord;
  describe('createBatch', () => {
    it('should throw error if creating batch fails', async () => {
      repositoryMock.createBatch.mockRejectedValue(new Error('Error creating batch'));

      await expect(batchService.createBatch(createBatchModel)).rejects.toThrow(
        'Error creating batch',
      );
    });

    it('should create batch successfully', async () => {
      repositoryMock.createBatch.mockResolvedValue(batchId);

      const result = await batchService.createBatch(createBatchModel);
      expect(result).toEqual(batchId);
    });
  });

  describe('createBatchEntry', () => {
    it('should throw error if creating batch entry fails', async () => {
      repositoryMock.createBatchEntry.mockRejectedValue(new Error('Error creating batch entry'));

      await expect(batchService.createBatchEntry(batchEntryModel)).rejects.toThrow(
        'Error creating batch entry',
      );
    });

    it('should create batch entry successfully', async () => {
      repositoryMock.createBatchEntry.mockResolvedValue(batchId);
      const result = await batchService.createBatchEntry(batchEntryModel);
      expect(result).toEqual(batchId);
    });
  });

  describe('updateBatchFile', () => {
    const updateBatchModel: UpdateBatchModel = {
      status: BatchStatus.BATCH_COMPLETE,
    };

    it('should update batch successfully', async () => {
      await batchService.updateBatch(batchId, updateBatchModel);

      expect(repositoryMock.updateBatch).toHaveBeenCalledWith(batchId, updateBatchModel);
    });
  });

  describe('getBatchEntries', () => {
    it('should throw error if getting batch entries fails', async () => {
      repositoryMock.getBatchEntries.mockRejectedValue(new Error('Error getting batch entries'));

      await expect(batchService.getBatchEntries(batchId)).rejects.toThrow(
        'Error getting batch entries',
      );
    });

    it('should get batch entries successfully', async () => {
      const batchEntry: BatchEntryModel = {
        batchId: batchId,
        cardNumber: cardNumber,
        memberId: memberId,
        applicationId: applicationId,
      };
      repositoryMock.getBatchEntries.mockResolvedValue([batchEntry]);

      const result = await batchService.getBatchEntries(batchId);

      expect(result).toEqual([batchEntry]);
    });
  });

  describe('fixBatch', () => {
    it('should throw error if getting batch entries fails', async () => {
      repositoryMock.getBatchEntries.mockRejectedValue(new Error('Error getting batch entries'));

      await expect(batchService.getBatchEntries(batchId)).rejects.toThrow(
        'Error getting batch entries',
      );
    });

    it('should skip processing card if cards in batch are not a valid status', async () => {
      const batchEntry: BatchEntryModel = {
        batchId: batchId,
        cardNumber: cardNumber,
        memberId: memberId,
        applicationId: applicationId,
      };
      const card: CardModel = {
        cardStatus: CardStatus.PHYSICAL_CARD,
        createdDate: '2023-01-01T00:00:00.000Z',
        nameOnCard: 'John Doe',
        purchaseDate: '2023-01-01T00:00:00.000Z',
        memberId,
        cardNumber,
        expiryDate: '2024-01-01',
      };
      repositoryMock.getBatchEntries.mockResolvedValue([batchEntry, batchEntry]);
      cardServiceMock.getCard.mockResolvedValue(card);

      await batchService.fixBatch(batchId);

      expect(repositoryMock.getBatchEntries).toHaveBeenCalled();
      expect(cardServiceMock.getCard).toHaveBeenCalledWith(
        batchEntry.memberId,
        batchEntry.cardNumber,
      );
      expect(cardServiceMock.processPrintedCard).not.toHaveBeenCalled();
    });

    it('should fix batch successfully', async () => {
      const batchEntry: BatchEntryModel = {
        batchId: batchId,
        cardNumber: cardNumber,
        memberId: memberId,
        applicationId: applicationId,
      };
      const card: CardModel = {
        cardStatus: CardStatus.ADDED_TO_BATCH,
        createdDate: '2023-01-01T00:00:00.000Z',
        nameOnCard: 'John Doe',
        purchaseDate: '2023-01-01T00:00:00.000Z',
        memberId,
        cardNumber,
        expiryDate: '2024-01-01',
      };
      repositoryMock.getBatchEntries.mockResolvedValue([batchEntry, batchEntry]);
      cardServiceMock.getCard.mockResolvedValue(card);

      await batchService.fixBatch(batchId);

      expect(repositoryMock.getBatchEntries).toHaveBeenCalled();
      expect(cardServiceMock.getCard).toHaveBeenCalledWith(
        batchEntry.memberId,
        batchEntry.cardNumber,
      );
      expect(cardServiceMock.processPrintedCard).toHaveBeenCalledWith(
        card.memberId,
        card.cardNumber,
        '2022-12-31T00:00:00.000Z',
        '2023-01-01T00:00:00.000Z',
      );
      expect(repositoryMock.updateBatch).toHaveBeenCalledWith(batchId, {
        status: BatchStatus.BATCH_COMPLETE,
        closedDate: '2023-01-01T00:00:00.000Z',
      });
    });
  });

  describe('generateExternalBatchesFile', () => {
    it('should set printing error for invalid cards and not create batch', async () => {
      const validCard = createCard();
      const invalidCard = createCard({ nameOnCard: 'This Name Is Far Too Long For Batching' });
      cardServiceMock.getCardsWithStatus.mockResolvedValue([validCard, invalidCard]);

      const profileWithoutCounty = { ...profile };
      delete profileWithoutCounty.county;
      profileServiceMock.getProfile.mockResolvedValue(profileWithoutCounty);

      await batchService.generateExternalBatchesFile();

      expect(cardServiceMock.updateCard).toHaveBeenCalledWith(memberId, validCard.cardNumber, {
        cardStatus: validCard.cardStatus,
        printingErrorStatus: PrintingErrorStatus.MISSING_ADDRESS,
      });

      expect(cardServiceMock.updateCard).toHaveBeenCalledWith(memberId, invalidCard.cardNumber, {
        cardStatus: invalidCard.cardStatus,
        printingErrorStatus: PrintingErrorStatus.MISSING_ADDRESS_AND_NAME_TOO_LONG,
      });

      expect(repositoryMock.createBatch).not.toHaveBeenCalled();
    });

    it('should create batch file successfully and upload correct CSV', async () => {
      const cardArray = [createCard(), createCard(), createCard()];
      cardServiceMock.getCardsWithStatus.mockResolvedValue(cardArray);
      profileServiceMock.getProfile.mockResolvedValue(profile);
      repositoryMock.createBatch.mockResolvedValue(batchId);

      isBlcUkBrandMock.mockReturnValue(true);
      getBrandFromEnvMock.mockReturnValue(BLC_UK_BRAND);

      const expectedBatch: CreateBatchModel = {
        name: 'batch#2023-01-01T00:00:00.000Z',
        type: BatchType.EXTERNAL,
        count: 3,
      };

      await batchService.generateExternalBatchesFile();

      expect(repositoryMock.createBatch).toHaveBeenCalledWith(expectedBatch);
      expect(repositoryMock.createBatchEntry).toHaveBeenCalledTimes(3);

      cardArray.forEach((card) => {
        expect(cardServiceMock.updateCard).toHaveBeenCalledWith(memberId, card.cardNumber, {
          cardStatus: CardStatus.ADDED_TO_BATCH,
        });
      });

      const expectedBodyLines = cardArray.map(() =>
        [
          memberId,
          cardNumber,
          '31/12/2023',
          'John',
          'Doe',
          'Example St',
          '',
          'City',
          'Essex',
          'PT14RF',
          batchId,
        ].join('|'),
      );

      const expectedBody = expectedBodyLines.join('\r\n');

      expect(s3ClientMock.upload).toHaveBeenCalledWith({
        Bucket: 'batchFileBucketMock',
        Key: `blc-uk/outbound/${batchId}.csv`,
        Body: expectedBody,
        ContentType: 'text/csv',
      });
    });
  });

  describe('processInboundBatchFile', () => {
    it('should throw error if downloading file from s3 fails', async () => {
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockRejectedValue(new Error('Error downloading file from S3')),
      }));

      await expect(batchService.processInboundBatchFile(record)).rejects.toThrow(
        'Error downloading file from S3',
      );
    });

    it('should throw error if file is unexpected type', async () => {
      const nonBufferFileType = { Body: {} } as S3.GetObjectOutput;
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue(nonBufferFileType),
      }));

      await expect(batchService.processInboundBatchFile(record)).rejects.toThrow(
        'Unexpected file type',
      );
    });

    it('should successfully parse csv and process cards and batches', async () => {
      const fileContent =
        `b607a45c-60e2-4935-8c35-dd2c582d58bb|BLC0879245|12/03/2026|13/03/2026|${batchId}\n` +
        `385c10cf-ca9b-4494-b1ce-3fcf787bad99|BLC0918746|12/03/2026|13/03/2026|${batchId}`;
      const s3File = { Body: Buffer.from(fileContent) } as S3.GetObjectOutput;
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue(s3File),
      }));

      await batchService.processInboundBatchFile(record);

      expect(cardServiceMock.processPrintedCard).toHaveBeenCalledWith(
        'b607a45c-60e2-4935-8c35-dd2c582d58bb',
        'BLC0879245',
        '2026-03-12T00:00:00.000Z',
        '2026-03-13T00:00:00.000Z',
      );
      expect(cardServiceMock.processPrintedCard).toHaveBeenCalledWith(
        '385c10cf-ca9b-4494-b1ce-3fcf787bad99',
        'BLC0918746',
        '2026-03-12T00:00:00.000Z',
        '2026-03-13T00:00:00.000Z',
      );
      expect(repositoryMock.updateBatch).toHaveBeenCalledWith(batchId, {
        status: BatchStatus.BATCH_COMPLETE,
        receivedDate: '2023-01-01T00:00:00.000Z',
        closedDate: '2023-01-01T00:00:00.000Z',
      });
    });
  });

  describe('uploadBatchFile', () => {
    const record = {
      s3: {
        bucket: {
          name: 'bucketName',
        },
        object: {
          key: key,
        },
      },
    } as S3EventRecord;

    beforeEach(() => {
      process.env.SFTP_HOST = 'testHost.co.uk';
      process.env.SFTP_USER = 'testUser';
      process.env.SFTP_PASSWORD = 'testPassword';
      process.env.SFTP_PATH_SEND_BATCH_FILE = '/testDirectory/';
    });

    it('should throw error if downloading file from s3 fails', async () => {
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockRejectedValue(new Error('Error downloading file from S3')),
      }));

      await expect(batchService.uploadBatchFile(record)).rejects.toThrow(
        'Error downloading file from S3',
      );
    });

    it('should throw error if file is unexpected type', async () => {
      const nonBufferFileType = { Body: {} } as S3.GetObjectOutput;
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue(nonBufferFileType),
      }));

      await expect(batchService.uploadBatchFile(record)).rejects.toThrow('Unexpected file type');
    });

    it('should throw error if sftp connection fails', async () => {
      const fileContent = 'test data';
      const s3File = { Body: Buffer.from(fileContent) } as S3.GetObjectOutput;
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue(s3File),
      }));
      Client.prototype.access = jest
        .fn()
        .mockRejectedValue(new Error('Error uploading file to SFTP server'));

      await expect(batchService.uploadBatchFile(record)).rejects.toThrow(
        'Error uploading file to SFTP server',
      );
    });

    it('should throw error if deleting file from s3 fails', async () => {
      const fileContent = 'test data';
      const s3File = { Body: Buffer.from(fileContent) } as S3.GetObjectOutput;
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue(s3File),
      }));
      Client.prototype.access = jest.fn().mockResolvedValue('Successful login');
      Client.prototype.uploadFrom = jest.fn().mockResolvedValue('Successful upload');
      Client.prototype.close = jest.fn().mockResolvedValue('Closed connection');
      S3.prototype.deleteObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockRejectedValue(new Error('Error deleting file from S3')),
      }));

      await expect(batchService.uploadBatchFile(record)).rejects.toThrow(
        'Error deleting file from S3',
      );
    });

    it('should successfully upload file to server and delete from s3', async () => {
      const fileContent = 'test data';
      const s3File = { Body: Buffer.from(fileContent) } as S3.GetObjectOutput;
      S3.prototype.getObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue(s3File),
      }));
      Client.prototype.access = jest.fn().mockResolvedValue('Successful login');
      Client.prototype.uploadFrom = jest.fn().mockResolvedValue('Successful upload');
      Client.prototype.close = jest.fn().mockResolvedValue('Closed connection');
      BatchService.prototype.updateBatch = jest.fn();
      S3.prototype.deleteObject = jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue('Deleted object'),
      }));

      await batchService.uploadBatchFile(record);

      expect(Client.prototype.access).toHaveBeenCalledWith({
        host: 'testHost.co.uk',
        user: 'testUser',
        password: 'testPassword',
        secure: true,
      });
      expect(Client.prototype.uploadFrom).toHaveBeenCalledWith(
        fileContent,
        `/testDirectory/${batchId}.csv`,
      );
      expect(Client.prototype.close).toHaveBeenCalled();
      expect(batchService.updateBatch).toHaveBeenCalledWith(batchId, {
        sentDate: '2023-01-01T00:00:00.000Z',
      });
      expect(S3.prototype.deleteObject).toHaveBeenCalledWith({
        Bucket: bucketName,
        Key: key,
      });
    });
  });

  describe('createInternalBatch', () => {
    let internalBatchService: BatchService;

    beforeEach(() => {
      internalBatchService = new BatchService(
        repositoryMock as BatchRepository,
        cardServiceMock as CardService,
        profileServiceMock as ProfileService,
        undefined as any,
      );
    });

    it('should create an internal batch with valid cards', async () => {
      const validCard1 = createCard({ cardNumber: 'CARD12345', nameOnCard: 'John Doe' });
      const validCard2 = createCard({ cardNumber: 'CARD67890', nameOnCard: 'Jane Doe' });

      cardServiceMock.getCardById
        .mockResolvedValueOnce(validCard1)
        .mockResolvedValueOnce(validCard2);

      jest
        .spyOn(internalBatchService as any, 'cardIsValidForBatch')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);
      jest
        .spyOn(internalBatchService as any, 'getProfileAndApplication')
        .mockResolvedValue([profile, application]);
      repositoryMock.createBatch.mockResolvedValue(batchId);
      repositoryMock.createBatchEntry.mockResolvedValue(batchId);

      const result = await internalBatchService.createInternalBatch('Internal Batch Test', [
        validCard1.cardNumber,
        validCard2.cardNumber,
      ]);
      expect(result).toEqual({ batchId });
      expect(repositoryMock.createBatchEntry).toHaveBeenCalledTimes(2);
      expect(cardServiceMock.updateCard).toHaveBeenCalledTimes(2);
    });

    it('should create an internal batch with only valid cards', async () => {
      const validCard = createCard({ cardNumber: 'CARD12345' });
      const invalidCard = createCard({ cardNumber: 'CARD67890' });

      cardServiceMock.getCardById
        .mockResolvedValueOnce(validCard)
        .mockResolvedValueOnce(invalidCard);

      jest
        .spyOn(internalBatchService as any, 'cardIsValidForBatch')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      jest
        .spyOn(internalBatchService as any, 'getProfileAndApplication')
        .mockResolvedValue([profile, application]);
      repositoryMock.createBatch.mockResolvedValue(batchId);

      const result = await internalBatchService.createInternalBatch('Internal Batch Test', [
        validCard.cardNumber,
        invalidCard.cardNumber,
      ]);

      expect(repositoryMock.createBatchEntry).toHaveBeenCalledTimes(1);
      expect(cardServiceMock.updateCard).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ batchId });
    });

    it('should throw if an error occurs', async () => {
      cardServiceMock.getCardById.mockRejectedValue(new Error('Failure retrieving card'));
      await expect(
        internalBatchService.createInternalBatch('Internal Batch Test', ['CARD12345']),
      ).rejects.toThrow('Failure retrieving card');
    });
  });
});
