import { ApplicationService } from '../applicationService';
import { ApplicationRepository } from '../../repositories/applicationRepository';
import { PromoCodeService } from '../promoCodeService';
import { S3 } from 'aws-sdk';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { EligibilityStatus } from '../../models/enums/EligibilityStatus';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../repositories/applicationRepository');
jest.mock('../promoCodeService');
jest.mock('aws-sdk');
jest.mock('sst/node/bucket', () => ({
  Bucket: jest.fn(),
}));
jest.mock('sst/node/table', () => ({
  Table: jest.fn(),
}));

describe('ApplicationService', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  let applicationService: ApplicationService;
  let repositoryMock: jest.Mocked<ApplicationRepository>;
  let promoCodeServiceMock: jest.Mocked<PromoCodeService>;
  let s3ClientMock: jest.Mocked<S3>;

  beforeEach(() => {
    repositoryMock = new ApplicationRepository() as jest.Mocked<ApplicationRepository>;
    promoCodeServiceMock = new PromoCodeService() as jest.Mocked<PromoCodeService>;
    s3ClientMock = new S3() as jest.Mocked<S3>;

    applicationService = new ApplicationService(
      repositoryMock,
      promoCodeServiceMock,
      s3ClientMock,
      'mockBucketName',
    );
  });

  describe('createApplication', () => {
    it('should throw error if create fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.upsertApplication.mockRejectedValue(error);

      await expect(applicationService.createApplication({ memberId } as any)).rejects.toThrow(
        error,
      );
    });

    it('should create an application successfully', async () => {
      repositoryMock.upsertApplication.mockResolvedValue(applicationId);

      const result = await applicationService.createApplication({ memberId } as any);

      expect(result).toBe(applicationId);
    });
  });

  describe('updateApplication', () => {
    it('should throw error if update fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.upsertApplication.mockRejectedValue(error);

      await expect(
        applicationService.updateApplication({ memberId, applicationId } as any),
      ).rejects.toThrow(error);
    });

    it('should validate promo code if provided', async () => {
      const application = { memberId, applicationId, promoCode: 'PROMO' } as any;
      repositoryMock.upsertApplication.mockResolvedValue(applicationId);

      await applicationService.updateApplication(application);

      expect(promoCodeServiceMock.validatePromoCode).toHaveBeenCalledWith(memberId, 'PROMO');
    });

    it('should update an application successfully', async () => {
      const application = { memberId, applicationId } as any;
      repositoryMock.upsertApplication.mockResolvedValue(applicationId);

      await applicationService.updateApplication(application);

      expect(repositoryMock.upsertApplication).toHaveBeenCalledWith({
        memberId,
        applicationId,
        application,
        isInsert: false,
      });
    });
  });

  describe('generateDocumentUploadUrl', () => {
    it('should throw validation error if application is not awaiting ID approval', async () => {
      repositoryMock.getApplication.mockResolvedValue({
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
      } as any);

      await expect(
        applicationService.generateDocumentUploadUrl(memberId, applicationId),
      ).rejects.toThrow(ValidationError);
    });

    it('should generate a presigned URL successfully', async () => {
      repositoryMock.getApplication.mockResolvedValue({
        eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
      } as any);
      s3ClientMock.getSignedUrlPromise.mockResolvedValue('mockUrl');

      const result = await applicationService.generateDocumentUploadUrl(memberId, applicationId);

      expect(result).toEqual({ preSignedUrl: 'mockUrl' });
    });
  });

  describe('getAllApplications', () => {
    it('should throw error if fetching all applications fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.getAllApplications.mockRejectedValue(error);

      await expect(applicationService.getAllApplications()).rejects.toThrow(error);
    });

    it('should fetch all applications successfully', async () => {
      const applications = [{ applicationId, memberId }] as any;
      repositoryMock.getAllApplications.mockResolvedValue(applications);

      const result = await applicationService.getAllApplications();

      expect(result).toBe(applications);
    });
  });

  describe('getApplications', () => {
    it('should throw error if fetching applications fails', async () => {
      const error = new Error('Repository error');
      repositoryMock.getApplications.mockRejectedValue(error);

      await expect(applicationService.getApplications(memberId)).rejects.toThrow(error);
    });

    it('should fetch applications for a member successfully', async () => {
      const applications = [{ applicationId, memberId }] as any;
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
      const application = { applicationId, memberId } as any;
      repositoryMock.getApplication.mockResolvedValue(application);

      const result = await applicationService.getApplication(memberId, applicationId);

      expect(result).toBe(application);
    });
  });
});
