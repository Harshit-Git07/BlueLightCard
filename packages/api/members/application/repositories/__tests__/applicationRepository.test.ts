import { DynamoDBDocumentClient, UpdateCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  ApplicationModel,
  CreateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import {
  applicationKey,
  memberKey,
} from '@blc-mono/members/application/repositories/base/repository';
import { ApplicationRepository } from '@blc-mono/members/application/repositories/applicationRepository';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        getSignedUrlPromise: jest.fn().mockResolvedValue('signedUrl'),
      };
    }),
  };
});
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('@blc-mono/members/application/providers/Tables', () => ({
  memberProfilesTableName: () => 'memberProfiles',
}));

const memberId = '9d2632fb-8983-4f09-bfa1-f652b17e9ca1';
const applicationId = '7d92ad80-8691-4fc7-839a-715384a8a5e0';
const application: ApplicationModel = {
  memberId,
  applicationId,
  applicationReason: ApplicationReason.SIGNUP,
};

let repository: ApplicationRepository;

const dynamoDbSend = jest.fn();
const dynamoDBMock = {
  send: dynamoDbSend,
} as unknown as DynamoDBDocumentClient;
const updateCommandMock = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;
const putCommandMock = PutCommand as jest.MockedClass<typeof PutCommand>;

describe('ApplicationRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
    repository = new ApplicationRepository(dynamoDBMock);
  });

  describe('createApplication', () => {
    it('should create a new application', async () => {
      (uuidv4 as jest.Mock).mockReturnValue(applicationId);
      dynamoDbSend.mockResolvedValue({});

      const result = await repository.createApplication(
        memberId,
        CreateApplicationModel.parse(application),
      );

      expect(result).toBe(applicationId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        Item: {
          applicationId: applicationId,
          applicationReason: 'SIGNUP',
          lastUpdated: '2023-01-01T00:00:00.000Z',
          memberId: memberId,
          pk: `MEMBER#${memberId}`,
          sk: `APPLICATION#${applicationId}`,
        },
        TableName: 'memberProfiles',
      });
    });
  });

  describe('updateApplication', () => {
    it('should update an existing application', async () => {
      dynamoDbSend.mockResolvedValue({});

      await repository.updateApplication(memberId, applicationId, application);

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Key: {
          pk: memberKey(memberId),
          sk: applicationKey(applicationId),
        },
        ExpressionAttributeNames: {
          '#applicationId': 'applicationId',
          '#applicationReason': 'applicationReason',
          '#lastUpdated': 'lastUpdated',
          '#memberId': 'memberId',
        },
        ExpressionAttributeValues: {
          ':applicationId': applicationId,
          ':applicationReason': 'SIGNUP',
          ':lastUpdated': '2023-01-01T00:00:00.000Z',
          ':memberId': memberId,
        },
        UpdateExpression:
          'SET #memberId = :memberId, #applicationId = :applicationId, #applicationReason = :applicationReason, #lastUpdated = :lastUpdated ',
      });
    });
  });

  describe('getApplications', () => {
    it('should return an empty array if no applications are found for the member', async () => {
      dynamoDbSend.mockResolvedValue({ Items: [] });

      const result = await repository.getApplications(memberId);

      expect(result).toEqual([]);
    });

    it('should return applications for the member', async () => {
      const items = [application];
      dynamoDbSend.mockResolvedValue({ Items: items });

      const result = await repository.getApplications(memberId);

      expect(result).toEqual(items.map((item) => ApplicationModel.parse(item)));
    });
  });

  describe('getApplication', () => {
    it('should throw NotFoundError if application is not found', async () => {
      dynamoDbSend.mockResolvedValue({ Item: null });

      await expect(repository.getApplication(memberId, applicationId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should return the application if found', async () => {
      dynamoDbSend.mockResolvedValue({ Item: application });

      const result = await repository.getApplication(memberId, applicationId);

      expect(result).toEqual(ApplicationModel.parse(application));
    });
  });

  describe('getDocumentsFromApplication', () => {
    it('should throw NotFoundError if application is not found', async () => {
      dynamoDbSend.mockResolvedValue({ Item: null });

      await expect(repository.getDocumentsFromApplication(memberId, applicationId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should return documents if application is found', async () => {
      const documents = ['doc1', 'doc2'];
      dynamoDbSend.mockResolvedValue({ Item: { documents } });

      const result = await repository.getDocumentsFromApplication(memberId, applicationId);

      expect(result).toEqual(['doc1', 'doc2']);
    });
  });

  describe('approveApplication', () => {
    it('should update the application with eligibility status', async () => {
      dynamoDbSend.mockResolvedValue({});

      await repository.approveApplication(memberId, applicationId);

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Key: {
          pk: memberKey(memberId),
          sk: applicationKey(applicationId),
        },
        UpdateExpression: 'REMOVE assignedTo SET eligibilityStatus = :eligibilityStatus',
        ExpressionAttributeValues: {
          ':eligibilityStatus': EligibilityStatus.ELIGIBLE,
        },
      });
    });
  });

  describe('rejectApplication', () => {
    [
      RejectionReason.PICTURE_DECLINE_ID,
      RejectionReason.PASSWORD_PROTECTED_DECLINE_ID,
      RejectionReason.DL_PP_DECLINE_ID,
      RejectionReason.DIFFERENT_NAME_DECLINE_ID,
      RejectionReason.DECLINE_NOT_ELIGIBLE,
      RejectionReason.DATE_DECLINE_ID,
      RejectionReason.DECLINE_INCORRECT_ID,
      RejectionReason.BLURRY_IMAGE_DECLINE_ID,
    ].forEach((rejectionReason) => {
      it('should update the application with rejection reason', async () => {
        dynamoDbSend.mockResolvedValue({});

        await repository.rejectApplication(memberId, applicationId, rejectionReason);

        expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
        expect(updateCommandMock).toHaveBeenCalledWith({
          TableName: 'memberProfiles',
          Key: {
            pk: memberKey(memberId),
            sk: applicationKey(applicationId),
          },
          UpdateExpression:
            'REMOVE assignedTo SET eligibilityStatus = :eligibilityStatus, rejectionReason = :rejectionReason',
          ExpressionAttributeValues: {
            ':eligibilityStatus': EligibilityStatus.INELIGIBLE,
            ':rejectionReason': rejectionReason,
          },
        });
      });
    });
  });
});
