import { ApplicationService } from '../applicationService';
import { ApplicationRepository } from '../../repositories/applicationRepository';
import { PromoCodesService } from '../promoCodesService';
import { S3 } from 'aws-sdk';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { EligibilityStatus } from '../../models/enums/EligibilityStatus';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '../../models/applicationModel';
import { ApplicationReason } from '../../models/enums/ApplicationReason';
import { ProfileService } from '../profileService';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../repositories/applicationRepository');
jest.mock('../promoCodesService');
jest.mock('../profileService');
jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrlPromise: jest.fn(),
  })),
}));
jest.mock('uuid');

const mockedUuidv4 = jest.mocked(uuidv4);

describe('ApplicationService', () => {
  const memberId = '7d92ad80-8691-4fc7-839a-715384a8a5e0';
  const applicationId = '9d2632fb-8983-4f09-bfa1-f652b17e9ca1';
  const createApplication: CreateApplicationModel = {
    applicationReason: ApplicationReason.SIGNUP,
    eligibilityStatus: EligibilityStatus.ELIGIBLE,
    startDate: '2024-01-01T00:00:00Z',
  };
  const updateApplication: UpdateApplicationModel = {
    city: 'New York',
  };
  const documentId = '7d92ad80-8983-4f09-bfa1-f652b17e9ca1';

  let applicationService: ApplicationService;
  let repositoryMock: jest.Mocked<ApplicationRepository>;
  let profileServiceMock: jest.Mocked<ProfileService>;
  let promoCodeServiceMock: jest.Mocked<PromoCodesService>;
  let s3ClientMock: jest.Mocked<S3>;

  beforeEach(() => {
    repositoryMock = new ApplicationRepository() as jest.Mocked<ApplicationRepository>;
    profileServiceMock = new ProfileService() as jest.Mocked<ProfileService>;
    promoCodeServiceMock = new PromoCodesService() as jest.Mocked<PromoCodesService>;
    s3ClientMock = new S3() as jest.Mocked<S3>;

    applicationService = new ApplicationService(
      repositoryMock,
      profileServiceMock,
      promoCodeServiceMock,
      s3ClientMock,
      'mockBucketName',
    );
  });

  describe('createApplication', () => {
    it('should throw error if create fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.createApplication.mockRejectedValue(error);

      await expect(
        applicationService.createApplication(memberId, createApplication),
      ).rejects.toThrow(error);
    });

    it('should create an application successfully', async () => {
      repositoryMock.createApplication.mockResolvedValue(applicationId);

      const result = await applicationService.createApplication(memberId, createApplication);

      expect(result).toBe(applicationId);
    });
  });

  describe('updateApplication', () => {
    it('should throw error if update fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.updateApplication.mockRejectedValue(error);

      await expect(
        applicationService.updateApplication(memberId, applicationId, updateApplication),
      ).rejects.toThrow(error);
    });

    it('should update an application successfully', async () => {
      await applicationService.updateApplication(memberId, applicationId, updateApplication);

      expect(repositoryMock.updateApplication).toHaveBeenCalledWith(
        memberId,
        applicationId,
        updateApplication,
      );
    });
  });

  describe('generateDocumentUploadUrl', () => {
    it('should throw validation error if application is not awaiting ID approval', async () => {
      repositoryMock.getApplication.mockResolvedValue({
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
      } as unknown as ApplicationModel);

      await expect(
        applicationService.generateDocumentUploadUrl(memberId, applicationId),
      ).rejects.toThrow(ValidationError);
    });

    it('should generate a presigned URL successfully', async () => {
      repositoryMock.getApplication.mockResolvedValue({
        eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
      } as unknown as ApplicationModel);
      s3ClientMock.getSignedUrlPromise.mockResolvedValue('mockUrl');
      mockedUuidv4.mockReturnValue('439a7a9a-7255-41d1-9435-d2a21e5f7e72');

      const result = await applicationService.generateDocumentUploadUrl(memberId, applicationId);

      expect(result).toEqual({
        documentId: '439a7a9a-7255-41d1-9435-d2a21e5f7e72',
        preSignedUrl: 'mockUrl',
      });
    });
  });

  describe('documentUploadComplete', () => {
    it('should record document upload successfully', async () => {
      await applicationService.documentUploadComplete(memberId, applicationId, documentId);

      expect(profileServiceMock.createNote).toHaveBeenCalledWith(
        memberId,
        expect.objectContaining({ category: 'ID Uploaded' }),
      );
    });
  });

  describe('getApplications', () => {
    it('should throw error if fetching applications fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.getApplications.mockRejectedValue(error);

      await expect(applicationService.getApplications(memberId)).rejects.toThrow(error);
    });

    it('should fetch applications for a member successfully', async () => {
      const applications: ApplicationModel[] = [
        { applicationId, memberId } as unknown as ApplicationModel,
      ];

      repositoryMock.getApplications.mockResolvedValue(applications);

      const result = await applicationService.getApplications(memberId);

      expect(result).toBe(applications);
    });
  });

  describe('getApplication', () => {
    it('should throw error if fetching application fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.getApplication.mockRejectedValue(error);

      await expect(applicationService.getApplication(memberId, applicationId)).rejects.toThrow(
        error,
      );
    });

    it('should fetch an application successfully', async () => {
      const application = { applicationId, memberId } as unknown as ApplicationModel;
      repositoryMock.getApplication.mockResolvedValue(application);

      const result = await applicationService.getApplication(memberId, applicationId);

      expect(result).toBe(application);
    });
  });
});
