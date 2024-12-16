import { BatchService } from '@blc-mono/members/application/services/batchService';
import { BatchRepository } from '@blc-mono/members/application/repositories/batchRepository';
import { CreateBatchModel } from '@blc-mono/members/application/models/batchModel';
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
import { isBlcUkBrand, getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { BLC_UK_BRAND } from '@blc-mono/core/constants/common';

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
