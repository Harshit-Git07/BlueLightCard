import { S3 } from 'aws-sdk';
import { Bucket } from 'sst/node/bucket';
import { isAfter, subDays } from 'date-fns';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationRepository } from '@blc-mono/members/application/repositories/applicationRepository';
import { CardRepository } from '@blc-mono/members/application/repositories/cardRepository';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { logger } from '../middleware';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import {
  DocumentListPresignedUrl,
  DocumentUploadLocation,
} from '@blc-mono/shared/models/members/documentUpload';
import { ApplicationBatchApprovalModel } from '@blc-mono/shared/models/members/applicationApprovalModel';
import { NoteSource } from '@blc-mono/shared/models/members/enums/NoteSource';
import { PromoCodesService } from './promoCodesService';
import { TrustedDomainService } from './trustedDomainService';
import { ProfileRepository } from '../repositories/profileRepository';
import { OrganisationRepository } from '../repositories/organisationRepository';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import { EmailService } from './emailService';
import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';
import { EmailTemplate, getEmailTypeForApplicationRejectionReason } from '../types/emailTypes';

let applicationServiceSingleton: ApplicationService;

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
    private readonly trustedDomainService = new TrustedDomainService(
      new ProfileRepository(),
      new OrganisationRepository(),
    ),
    private readonly emailService = new EmailService(),
    private readonly cardRepository: CardRepository = new CardRepository(),
    private readonly s3Client: S3 = new S3({ region: process.env.REGION ?? 'eu-west-2' }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private readonly uploadBucketName: string = Bucket.documentUploadBucket.bucketName,
  ) {}

  async createApplication(
    memberId: string,
    applicationToCreate: CreateApplicationModel,
  ): Promise<string> {
    try {
      logger.debug({ message: 'Creating application', application: applicationToCreate });

      if (this.isExtendedReprintCardReason(applicationToCreate.applicationReason)) {
        if (await this.isCurrentCardWithin90Days(memberId)) {
          return await this.createReprintApplication(memberId, applicationToCreate);
        }

        return await this.createLostCardApplication(memberId, applicationToCreate);
      }

      return await this.repository.createApplication(memberId, applicationToCreate);
    } catch (error) {
      logger.error({ message: 'Error creating application', error });
      throw error;
    }
  }

  async updateApplication(
    memberId: string,
    applicationId: string,
    applicationUpdates: UpdateApplicationModel,
  ): Promise<void> {
    try {
      logger.debug({ message: 'Creating application', application: applicationUpdates });

      if (applicationUpdates.trustedDomainEmail) {
        await this.trustedDomainService.validateTrustedDomainEmail(
          memberId,
          applicationUpdates.trustedDomainEmail,
        );
      }

      await this.repository.updateApplication(memberId, applicationId, applicationUpdates);
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
    batch: ApplicationBatchApprovalModel,
  ): Promise<string[]> {
    try {
      logger.debug({ message: 'Assigning applications for approval', adminId, batch });
      let applicationIds: string[];
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

      await this.repository.assignApplicationBatch(adminId, applicationIds);
      return applicationIds;
    } catch (error) {
      logger.error({ message: 'Error assigning applications for approval', error });
      throw error;
    }
  }

  async releaseApplicationBatch(
    adminId: string,
    allocation: ApplicationBatchApprovalModel,
  ): Promise<void> {
    try {
      logger.debug({ message: `Releasing applications with IDs: ${allocation.applicationIds}` });
      await this.repository.releaseApplicationBatch(allocation.applicationIds!);
      await this.profileService.createNote(adminId, {
        text: `Application approval released. Reason: ${allocation.allocationRemovalReason}}`,
        source: NoteSource.ADMIN,
        category: 'Application Approval Released',
        pinned: false,
        creator: adminId,
      });
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

  async approveApplication(
    adminId: string,
    memberId: string,
    applicationId: string,
  ): Promise<void> {
    try {
      logger.debug({ message: 'Approving application', memberId, applicationId });
      await this.repository.approveApplication(memberId, applicationId);
      await this.profileService.createNote(memberId, {
        text: `Application Approved. Application ID ${applicationId}`,
        source: NoteSource.ADMIN,
        category: 'Application Approved',
        pinned: false,
        creator: adminId,
      });
      await this.sendEmailForApplicationDecision(memberId, 'id_approved');
    } catch (error) {
      logger.error({ message: 'Error approving application', error });
      throw error;
    }
  }

  async rejectApplication(
    adminId: string,
    memberId: string,
    applicationId: string,
    applicationRejectionReason: RejectionReason,
  ): Promise<void> {
    try {
      logger.debug({ message: 'Rejecting application', memberId, applicationId });
      await this.repository.rejectApplication(memberId, applicationId, applicationRejectionReason);
      await this.profileService.createNote(memberId, {
        text: `Application rejected. Reason: ${applicationRejectionReason}`,
        source: NoteSource.ADMIN,
        category: 'Application Rejected',
        pinned: false,
        creator: adminId,
      });
      await this.sendEmailForApplicationDecision(
        memberId,
        getEmailTypeForApplicationRejectionReason(applicationRejectionReason),
      );
    } catch (error) {
      logger.error({ message: 'Error rejecting application', error });
      throw error;
    }
  }

  private async sendEmailForApplicationDecision(
    memberId: string,
    emailType: EmailTemplate,
  ): Promise<void> {
    try {
      const profile = await this.profileService.getProfile(memberId);
      await this.emailService.sendEmail(emailType, {
        email: profile.email,
        subject: 'Application Approved',
        content: {
          F_Name: profile.firstName,
        },
      });
    } catch (error) {
      logger.error({ message: 'Error sending email for application decision', error });
    }
  }

  private async isCurrentCardWithin90Days(memberId: string): Promise<boolean> {
    try {
      const mostRecentCard = await this.getMostRecentCard(memberId);
      if (!mostRecentCard) return false;

      if (mostRecentCard.createdDate) {
        const createdDate = new Date(mostRecentCard.createdDate);
        const ninetyDaysAgo = subDays(new Date(), 90);
        return isAfter(createdDate, ninetyDaysAgo);
      }

      return false;
    } catch (error) {
      logger.error({ message: 'Error validating reprint card request', error });
      throw error;
    }
  }

  private async getMostRecentCard(memberId: string): Promise<CardModel | undefined> {
    const cards = await this.cardRepository.getCards(memberId);
    if (cards.length === 0) return undefined;

    cards.sort((card1, card2) => {
      if (card1.createdDate === null || card1.createdDate === undefined) return 1;
      if (card2.createdDate === null || card2.createdDate === undefined) return -1;

      const card1Date = new Date(card1.createdDate);
      const card2Date = new Date(card2.createdDate);
      return card2Date.getTime() - card1Date.getTime();
    });

    return cards[0];
  }

  private isExtendedReprintCardReason(reason: ApplicationReason | null): boolean {
    return reason === ApplicationReason.LOST_CARD || reason === ApplicationReason.REPRINT;
  }

  private async createReprintApplication(
    memberId: string,
    applicationToCreate: CreateApplicationModel,
  ) {
    const applicationOnDynamo = await this.repository.createApplication(memberId, {
      ...applicationToCreate,
      applicationReason: ApplicationReason.REPRINT,
    });
    await this.profileService.createNote(memberId, {
      text: `Reprint application created for reason '${applicationToCreate.reorderCardReason}' due to original card being created within 90 days`,
    });
    return applicationOnDynamo;
  }

  private async createLostCardApplication(
    memberId: string,
    applicationToCreate: CreateApplicationModel,
  ) {
    logger.info(
      'Application for reprint not within 90 days. Setting applicationReason to lost card.',
    );
    const applicationOnDynamo = await this.repository.createApplication(memberId, {
      ...applicationToCreate,
      applicationReason: ApplicationReason.LOST_CARD,
    });
    await this.profileService.createNote(memberId, {
      text: `Lost card application created for reason '${applicationToCreate.reorderCardReason}' due to original card being older than 90 days`,
    });
    return applicationOnDynamo;
  }
}

export function applicationService(): ApplicationService {
  if (!applicationServiceSingleton) {
    applicationServiceSingleton = new ApplicationService();
  }

  return applicationServiceSingleton;
}
