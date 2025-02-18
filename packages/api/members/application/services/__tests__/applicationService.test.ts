import { S3 } from 'aws-sdk';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { subDays } from 'date-fns';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { ReorderCardReason } from '@blc-mono/shared/models/members/enums/ReorderCardReason';
import { EmailService } from '@blc-mono/members/application/services/email/emailService';
import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';
import { NoteSource } from '@blc-mono/shared/models/members/enums/NoteSource';
import { TrustedDomainService } from '@blc-mono/members/application/services/trustedDomainService';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationRepository } from '@blc-mono/members/application/repositories/applicationRepository';
import { CardRepository } from '@blc-mono/members/application/repositories/cardRepository';

jest.mock('@blc-mono/members/application/repositories/applicationRepository');
jest.mock('@blc-mono/members/application/services/profileService');
jest.mock('@blc-mono/members/application/repositories/cardRepository');
jest.mock('@blc-mono/members/application/services/email/emailService');
jest.mock('@blc-mono/members/application/services/trustedDomainService');
jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrlPromise: jest.fn(),
    deleteObject: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve(),
    })),
  })),
}));
jest.mock('@blc-mono/members/application/providers/S3', () => ({
  documentUploadBucket: () => 'mockBucketName',
}));
jest.mock('@blc-mono/members/application/providers/Tables', () => ({
  getMemberProfilesTableName: () => 'TestTableProfiles',
  memberOrganisationsTableName: () => 'TestTableOrganisations',
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockedUuidv4 = jest.mocked(uuidv4);

describe('ApplicationService', () => {
  const memberId = '7d92ad80-8691-4fc7-839a-715384a8a5e0';
  const email = 'john.dow@nhs.com';
  const firstName = 'John';
  const lastName = 'Doe';
  const dateOfBirth = '1990-01-01';
  const applicationId = '9d2632fb-8983-4f09-bfa1-f652b17e9ca1';
  const createApplication: CreateApplicationModel = {
    applicationReason: ApplicationReason.SIGNUP,
    eligibilityStatus: EligibilityStatus.ELIGIBLE,
    startDate: '2024-01-01T00:00:00Z',
  };
  let applicationBeingUpdated: UpdateApplicationModel;
  const card: CardModel = {
    cardNumber: 'BLC123456789',
    cardStatus: CardStatus.PHYSICAL_CARD,
    createdDate: '2023-01-01T00:00:00.000Z',
    nameOnCard: 'John Doe',
    purchaseDate: '2023-01-01T00:00:00.000Z',
    memberId,
    expiryDate: '2024-01-01',
  };
  const documentId = '7d92ad80-8983-4f09-bfa1-f652b17e9ca1';

  let applicationService: ApplicationService;
  let repositoryMock: jest.Mocked<ApplicationRepository>;
  let profileServiceMock: jest.Mocked<ProfileService>;
  let trustedDomainServiceMock: jest.Mocked<TrustedDomainService>;
  let emailServiceMock: jest.Mocked<EmailService>;
  let cardRepositoryMock: jest.Mocked<CardRepository>;
  let s3ClientMock: jest.Mocked<S3>;

  beforeEach(() => {
    applicationBeingUpdated = {
      city: 'New York',
    };

    repositoryMock = new ApplicationRepository() as jest.Mocked<ApplicationRepository>;
    profileServiceMock = new ProfileService() as jest.Mocked<ProfileService>;
    trustedDomainServiceMock = new TrustedDomainService() as jest.Mocked<TrustedDomainService>;
    emailServiceMock = new EmailService() as jest.Mocked<EmailService>;
    cardRepositoryMock = new CardRepository() as jest.Mocked<CardRepository>;
    s3ClientMock = new S3() as jest.Mocked<S3>;

    applicationService = new ApplicationService(
      repositoryMock,
      profileServiceMock,
      trustedDomainServiceMock,
      emailServiceMock,
      cardRepositoryMock,
      s3ClientMock,
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

    describe('given the card was created within the last 90 days', () => {
      beforeEach(() => {
        repositoryMock.createApplication.mockResolvedValue(applicationId);
        const createdDate = subDays(new Date(), 89);
        const cards = [{ ...card, createdDate: createdDate.toISOString() }];
        cardRepositoryMock.getCards.mockResolvedValue(cards);
      });

      describe.each([
        {
          applicationReason: ApplicationReason.REPRINT,
          reorderCardReason: ReorderCardReason.CARD_NOT_RECEIVED_YET,
        },
        {
          applicationReason: ApplicationReason.LOST_CARD,
          reorderCardReason: ReorderCardReason.STOLEN_CARD,
        },
      ])('when application reason is "%s"', ({ applicationReason, reorderCardReason }) => {
        let result: string;

        beforeEach(async () => {
          result = await applicationService.createApplication(memberId, {
            applicationReason: applicationReason,
            reorderCardReason: reorderCardReason,
          });
        });

        it('should create application successfully', () => {
          expect(result).toBe(applicationId);
        });

        it('should create note', () => {
          expect(profileServiceMock.createNote).toHaveBeenCalledWith(memberId, {
            text: `Reprint application created for reason '${reorderCardReason}' due to original card being created within 90 days`,
          });
        });

        it('should create application with application reason "reprint"', () => {
          expect(repositoryMock.createApplication).toHaveBeenCalledWith(memberId, {
            applicationReason: ApplicationReason.REPRINT,
            reorderCardReason: reorderCardReason,
          });
        });
      });
    });

    describe('given the card was created more than 90 days ago', () => {
      beforeEach(() => {
        repositoryMock.createApplication.mockResolvedValue(applicationId);
        const createdDate = subDays(new Date(), 90);
        const cards = [{ ...card, createdDate: createdDate.toISOString() }];
        cardRepositoryMock.getCards.mockResolvedValue(cards);
      });

      describe.each([
        {
          applicationReason: ApplicationReason.LOST_CARD,
          reorderCardReason: ReorderCardReason.DAMAGED_CARD,
        },
        {
          applicationReason: ApplicationReason.REPRINT,
          reorderCardReason: ReorderCardReason.LOST_CARD,
        },
      ])('when application reason is "%s"', ({ applicationReason, reorderCardReason }) => {
        let result: string;

        beforeEach(async () => {
          result = await applicationService.createApplication(memberId, {
            applicationReason,
            reorderCardReason,
          });
        });

        it('should create application successfully', () => {
          expect(result).toBe(applicationId);
        });

        it('should create note', () => {
          expect(profileServiceMock.createNote).toHaveBeenCalledWith(memberId, {
            text: `Lost card application created for reason '${reorderCardReason}' due to original card being older than 90 days`,
          });
        });

        it('should create application with application reason "lost card"', () => {
          expect(repositoryMock.createApplication).toHaveBeenCalledWith(memberId, {
            applicationReason: ApplicationReason.LOST_CARD,
            reorderCardReason: reorderCardReason,
          });
        });
      });
    });
  });

  describe('updateApplication', () => {
    describe('given application has a trusted domain email', () => {
      beforeEach(() => {
        applicationBeingUpdated = {
          ...applicationBeingUpdated,
          trustedDomainEmail: 'blc@nsh.com',
        };
      });

      describe('when the provided trusted domain email is valid', () => {
        beforeEach(() => {
          trustedDomainServiceMock.validateTrustedDomainEmail.mockResolvedValue(undefined);
        });

        it('should update the application successfully', async () => {
          await applicationService.updateApplication(
            memberId,
            applicationId,
            applicationBeingUpdated,
          );

          expect(repositoryMock.updateApplication).toHaveBeenCalledWith(
            memberId,
            applicationId,
            applicationBeingUpdated,
          );
        });

        describe('given update fails', () => {
          const error = new Error('Repository error');

          beforeEach(() => {
            repositoryMock.updateApplication.mockRejectedValue(error);
          });

          it('should throw error if update fails', async () => {
            await expect(
              applicationService.updateApplication(
                memberId,
                applicationId,
                applicationBeingUpdated,
              ),
            ).rejects.toThrow(error);
          });
        });
      });

      describe('when the provided trusted domain email is invalid', () => {
        const validationError = new Error('mocked fail');

        beforeEach(() => {
          trustedDomainServiceMock.validateTrustedDomainEmail.mockRejectedValue(validationError);
        });

        it('should not update the application', async () => {
          await expect(
            applicationService.updateApplication(memberId, applicationId, applicationBeingUpdated),
          ).rejects.toThrow(validationError);
          expect(repositoryMock.updateApplication).not.toHaveBeenCalled();
        });
      });
    });

    describe('given a normal application is being updated', () => {
      it('should update the application successfully', async () => {
        await applicationService.updateApplication(
          memberId,
          applicationId,
          applicationBeingUpdated,
        );

        expect(repositoryMock.updateApplication).toHaveBeenCalledWith(
          memberId,
          applicationId,
          applicationBeingUpdated,
        );
      });

      describe('given update fails', () => {
        const error = new Error('Repository error');

        beforeEach(() => {
          repositoryMock.updateApplication.mockRejectedValue(error);
        });

        it('should throw error if update fails', async () => {
          await expect(
            applicationService.updateApplication(memberId, applicationId, applicationBeingUpdated),
          ).rejects.toThrow(error);
        });
      });
    });
  });

  describe('given a application is adding documents', () => {
    it('should update the application and set the documentUploadedDate', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2025, 1, 12, 12, 12, 12));

      applicationBeingUpdated = {
        documents: ['document1', 'document2', 'document3'],
      } as UpdateApplicationModel;

      await applicationService.updateApplication(memberId, applicationId, applicationBeingUpdated);

      expect(repositoryMock.updateApplication).toHaveBeenCalledWith(memberId, applicationId, {
        documents: ['document1', 'document2', 'document3'],
        documentsUploadedDate: '2025-02-12T12:12:12.000Z',
      });
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

  describe('approveApplication', () => {
    it('should throw error if approving application fails', async () => {
      const error = new Error('Repository error');

      repositoryMock.approveApplication.mockRejectedValue(error);

      await expect(
        applicationService.approveApplication(memberId, memberId, applicationId),
      ).rejects.toThrow(error);
    });

    it('should approve an application successfully', async () => {
      repositoryMock.getDocumentsFromApplication.mockResolvedValue([documentId]);
      profileServiceMock.getProfile.mockResolvedValue({
        memberId,
        email,
        firstName,
        lastName,
        dateOfBirth,
      });

      await applicationService.approveApplication(memberId, memberId, applicationId);

      expect(repositoryMock.approveApplication).toHaveBeenCalledWith(memberId, applicationId);
      expect(profileServiceMock.createNote).toHaveBeenCalledWith(memberId, {
        category: 'Application Approved',
        creator: memberId,
        pinned: false,
        source: NoteSource.ADMIN,
        text: `Application Approved. Application ID ${applicationId}`,
      });
      expect(s3ClientMock.deleteObject).toHaveBeenCalledWith({
        Bucket: 'mockBucketName',
        Key: `UPLOADS/${memberId}/${applicationId}/${documentId}`,
      });
    });
  });

  describe('rejectApplication', () => {
    const rejectionReason = RejectionReason.DIFFERENT_NAME_DECLINE_ID;

    it('should throw error if rejecting application fails', async () => {
      const error = new Error('Repository error');
      profileServiceMock.getProfile.mockResolvedValue({
        memberId,
        email,
        firstName,
        lastName,
        dateOfBirth,
      });

      repositoryMock.rejectApplication.mockRejectedValue(error);

      await expect(
        applicationService.rejectApplication(memberId, memberId, applicationId, rejectionReason),
      ).rejects.toThrow(error);
    });

    it('should reject an application successfully', async () => {
      repositoryMock.getDocumentsFromApplication.mockResolvedValue([documentId]);
      profileServiceMock.getProfile.mockResolvedValue({
        memberId,
        email,
        firstName,
        lastName,
        dateOfBirth,
      });

      await applicationService.rejectApplication(
        memberId,
        memberId,
        applicationId,
        RejectionReason.DIFFERENT_NAME_DECLINE_ID,
      );

      expect(repositoryMock.rejectApplication).toHaveBeenCalledWith(
        memberId,
        applicationId,
        rejectionReason,
      );
      expect(profileServiceMock.createNote).toHaveBeenCalledWith(memberId, {
        category: 'Application Rejected',
        creator: memberId,
        pinned: false,
        source: NoteSource.ADMIN,
        text: `Application rejected. Reason: ${rejectionReason}`,
      });
      expect(s3ClientMock.deleteObject).toHaveBeenCalledWith({
        Bucket: 'mockBucketName',
        Key: `UPLOADS/${memberId}/${applicationId}/${documentId}`,
      });
    });
  });
});
