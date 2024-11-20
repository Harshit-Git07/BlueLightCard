import { ApplicationRepository } from '../repositories/applicationRepository';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '../models/applicationModel';
import { logger } from '../middleware';
import { EligibilityStatus } from '../models/enums/EligibilityStatus';
import { DocumentUploadLocation } from '../models/documentUpload';
import { S3 } from 'aws-sdk';
import { Bucket } from 'sst/node/bucket';
import { PromoCodeService } from './promoCodeService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

export class ApplicationService {
  constructor(
    private readonly repository: ApplicationRepository = new ApplicationRepository(),
    private readonly promoCodeService: PromoCodeService = new PromoCodeService(),
    private readonly s3Client: S3 = new S3({ region: process.env.REGION ?? 'eu-west-2' }),
    // @ts-ignore
    private readonly uploadBucketName: string = Bucket.documentUploadBucket.bucketName,
  ) {}

  async createApplication(application: CreateApplicationModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating application', application });
      return await this.repository.upsertApplication({
        memberId: application.memberId,
        application,
        isInsert: true,
      });
    } catch (error) {
      logger.error({ message: 'Error creating application', error });
      throw error;
    }
  }

  async updateApplication(application: UpdateApplicationModel): Promise<void> {
    try {
      logger.debug({ message: 'Creating application', application });

      if (application.promoCode) {
        this.promoCodeService.validatePromoCode(application.memberId, application.promoCode);
      }

      await this.repository.upsertApplication({
        memberId: application.memberId,
        applicationId: application.applicationId,
        application,
        isInsert: false,
      });
    } catch (error) {
      logger.error({ message: 'Error creating application', error });
      throw error;
    }
  }

  async getAllApplications(): Promise<ApplicationModel[]> {
    try {
      logger.debug({ message: 'Fetching applications' });
      return await this.repository.getAllApplications();
    } catch (error) {
      logger.error({ message: 'Error fetching applications', error });
      throw error;
    }
  }

  async getApplications(memberId: string): Promise<ApplicationModel[]> {
    try {
      logger.debug({ message: 'Fetching applications', memberId });
      return await this.repository.getApplications(memberId);
    } catch (error) {
      logger.error({ message: 'Error fetching applications', error });
      throw error;
    }
  }

  async getApplication(memberId: string, applicationId: string): Promise<ApplicationModel> {
    try {
      logger.debug({ message: 'Fetching application', memberId, applicationId });
      return await this.repository.getApplication(memberId, applicationId);
    } catch (error) {
      logger.error({ message: 'Error fetching application', error });
      throw error;
    }
  }

  async generateDocumentUploadUrl(
    memberId: string,
    applicationId: string,
  ): Promise<DocumentUploadLocation> {
    try {
      logger.debug({
        message: 'Generating presigned URL for document upload',
        memberId,
        applicationId,
      });
      const application = await this.repository.getApplication(memberId, applicationId);

      if (
        application.eligibilityStatus !== EligibilityStatus.INELIGIBLE &&
        application.eligibilityStatus !== EligibilityStatus.AWAITING_ID_APPROVAL
      ) {
        throw new ValidationError('Application is not awaiting ID approval');
      }

      const key = `UPLOADS/${memberId}/${Date.now()}-ID-document`;
      const params = {
        Bucket: this.uploadBucketName,
        Key: key,
        Expires: 1500,
      };

      const preSignedUrl = await this.s3Client.getSignedUrlPromise('putObject', params);
      return {
        preSignedUrl,
      };
    } catch (error) {
      logger.error({ message: 'Error generating presigned URL', error });
      throw error;
    }
  }
}
