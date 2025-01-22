import { ApplicationRepository } from '../repositories/applicationRepository';
import { v4 as uuidv4 } from 'uuid';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import { logger } from '../middleware';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import {
  DocumentListPresignedUrl,
  DocumentUploadLocation,
} from '@blc-mono/shared/models/members/documentUpload';
import { S3 } from 'aws-sdk';
import { Bucket } from 'sst/node/bucket';
import { PromoCodesService } from './promoCodesService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { ProfileService } from './profileService';
import { ApplicationBatchApprovalModel } from '@blc-mono/shared/models/members/applicationApprovalModel';
import { NoteSource } from '@blc-mono/shared/models/members/enums/NoteSource';

export interface ApplicationSearch {
  eligibilityStatus?: EligibilityStatus;
  organisationId?: string;
  employerId?: string;
  startDate?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ApplicationSearchResult {
  memberId: string;
  applicationId: string;
  organisationId?: string;
  employerId?: string;
  startDate?: string;
  eligibilityStatus: EligibilityStatus;
}

export class ApplicationService {
  constructor(
    private readonly repository: ApplicationRepository = new ApplicationRepository(),
    private readonly profileService: ProfileService = new ProfileService(),
    private readonly promoCodeService: PromoCodesService = new PromoCodesService(),
    private readonly s3Client: S3 = new S3({ region: process.env.REGION ?? 'eu-west-2' }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private readonly uploadBucketName: string = Bucket.documentUploadBucket.bucketName,
  ) {}

  async createApplication(memberId: string, application: CreateApplicationModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating application', application });
      return await this.repository.createApplication(memberId, application);
    } catch (error) {
      logger.error({ message: 'Error creating application', error });
      throw error;
    }
  }

  async updateApplication(
    memberId: string,
    applicationId: string,
    application: UpdateApplicationModel,
  ): Promise<void> {
    try {
      logger.debug({ message: 'Updating application', application });
      await this.repository.updateApplication(memberId, applicationId, application);
    } catch (error) {
      logger.error({ message: 'Error updating application', error });
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

      const documentId = uuidv4();
      const key = `UPLOADS/${memberId}/${applicationId}/${documentId}`;
      const params = {
        Bucket: this.uploadBucketName,
        Key: key,
        Expires: 1500,
      };

      const preSignedUrl = await this.s3Client.getSignedUrlPromise('putObject', params);
      return {
        preSignedUrl,
        documentId,
      };
    } catch (error) {
      logger.error({ message: 'Error generating presigned URL', error });
      throw error;
    }
  }

  async documentUploadComplete(
    memberId: string,
    applicationId: string,
    documentId: string,
  ): Promise<void> {
    try {
      logger.info({ message: 'Recording document upload', memberId, applicationId, documentId });

      await this.profileService.createNote(memberId, {
        text: `ID document uploaded successfully`,
        source: NoteSource.SYSTEM,
        category: 'ID Uploaded',
        pinned: false,
      });
    } catch (error) {
      logger.error({ message: 'Error recording document upload', error });
      throw error;
    }
  }

  async getDocumentsFromApplication(
    memberId: string,
    applicationId: string,
  ): Promise<DocumentListPresignedUrl> {
    try {
      logger.debug({ message: 'Fetching documents from application', memberId, applicationId });

      const retrievedDocuments = await this.repository.getDocumentsFromApplication(
        memberId,
        applicationId,
      );
      if (!retrievedDocuments) return { documents: [] };

      const preSignedUrls: DocumentListPresignedUrl['documents'] = [];
      for (const documentId of retrievedDocuments) {
        const key = `UPLOADS/${memberId}/${applicationId}/${documentId}`;
        const s3Params = {
          Bucket: this.uploadBucketName,
          Key: key,
          Expires: 1500,
        };
        const presignedUrl = await this.s3Client.getSignedUrlPromise('getObject', s3Params);
        preSignedUrls.push(presignedUrl);
      }
      return { documents: preSignedUrls };
    } catch (error) {
      logger.error({ message: 'Error fetching documents from application', error });
      throw error;
    }
  }

  async assignApplicationBatch(
    adminId: string,
    adminName: string,
    batch: ApplicationBatchApprovalModel,
  ): Promise<string[]> {
    try {
      logger.debug({ message: 'Assigning applications for approval', adminId, batch });

      let applicationIds: string[] = [];
      if (batch.organisationId) {
        applicationIds = (
          await this.searchApplications({
            organisationId: batch.organisationId,
            employerId: batch.employerId,
            eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
          })
        ).map((application) => application.applicationId);
      } else if (batch.applicationIds && batch.applicationIds.length > 0) {
        applicationIds = batch.applicationIds;
      } else {
        applicationIds = (
          await this.searchApplications({
            eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
            sort: 'asc',
          })
        ).map((application) => application.applicationId);
      }

      await this.repository.assignApplicationBatch(adminId, adminName, applicationIds);
      return applicationIds;
    } catch (error) {
      logger.error({ message: 'Error assigning applications for approval', error });
      throw error;
    }
  }

  async releaseApplicationBatch(adminId: string, applicationIds: string[]): Promise<void> {
    try {
      logger.debug({ message: 'Removing application approvals', adminId, applicationIds });
      await this.repository.releaseApplicationBatch(adminId, applicationIds);
    } catch (error) {
      logger.error({ message: 'Error removing application approvals', error });
      throw error;
    }
  }

  // TODO: This is temporary until we have OpenSearch in place
  async searchApplications(searchQuery: ApplicationSearch): Promise<ApplicationSearchResult[]> {
    try {
      logger.debug({ message: 'Searching applications' });

      const applications = (await this.repository.getAllApplications())
        .filter(
          (application) =>
            !searchQuery.eligibilityStatus ||
            searchQuery.eligibilityStatus === application.eligibilityStatus,
        )
        .map(async (application) => {
          const profile = await this.profileService.getProfile(application.memberId);
          return {
            memberId: application.memberId,
            applicationId: application.applicationId,
            organisationId: profile.organisationId,
            employerId: profile.employerId,
            startDate: application.startDate,
            eligibilityStatus:
              application.eligibilityStatus || EligibilityStatus.AWAITING_ID_APPROVAL,
          };
        });

      return (await Promise.all(applications))
        .filter(
          (application) =>
            !searchQuery.organisationId ||
            searchQuery.organisationId === application.organisationId,
        )
        .filter(
          (application) =>
            !searchQuery.employerId || searchQuery.employerId === application.employerId,
        );
    } catch (error) {
      logger.error({ message: 'Error searching applications', error });
      throw error;
    }
  }

  async approveApplication(memberId: string, applicationId: string): Promise<void> {
    try {
      logger.debug({ message: 'Approving application', memberId, applicationId });
      await this.repository.updateApplication(memberId, applicationId, {
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
      });
    } catch (error) {
      logger.error({ message: 'Error approving application', error });
      throw error;
    }
  }

  async rejectApplication(memberId: string, applicationId: string): Promise<void> {
    try {
      logger.debug({ message: 'Rejecting application', memberId, applicationId });
      await this.repository.updateApplication(memberId, applicationId, {
        eligibilityStatus: EligibilityStatus.INELIGIBLE,
      });
    } catch (error) {
      logger.error({ message: 'Error rejecting application', error });
      throw error;
    }
  }
}
