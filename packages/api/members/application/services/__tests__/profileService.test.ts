import { ProfileService } from '../profileService';
import { ProfileRepository } from '../../repositories/profileRepository';
import { OrganisationService } from '../organisationService';
import { Auth0ClientService } from '../../auth0/auth0ClientService';
import { v4 as uuidv4 } from 'uuid';
import { OrganisationModel } from '../../models/organisationModel';
import { EmployerModel } from '../../models/employerModel';
import { CreateProfileModel } from '../../models/profileModel';
import { NotFoundError } from '../../errors/NotFoundError';
import { PasswordChangeModel } from '../../models/passwordChangeModel';
import { EmailChangeModel } from '../../models/emailChangeModel';
import { EmploymentStatus } from '../../models/enums/EmploymentStatus';
import { NoteModel } from '../../models/noteModel';
import { NoteSource } from '../../models/enums/NoteSource';
import { IdType } from '../../models/enums/IdType';
import { EmailService } from '../../email/emailService';
import { TokenSet } from 'auth0';

jest.mock('../../repositories/profileRepository');
jest.mock('../organisationService');
jest.mock('../../auth0/auth0ClientService');
jest.mock('../../email/emailService');

describe('ProfileService', () => {
  const memberId = uuidv4();
  const organisationId = uuidv4();
  const employerId = uuidv4();
  const newProfile: CreateProfileModel = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2024-01-01',
  };
  const profile = {
    memberId,
    ...newProfile,
    organisationId,
    employerId,
    applications: [],
  };
  const supportedDocument = {
    idKey: 'passport',
    title: 'Passport',
    description: 'Passport Document',
    type: IdType.IMAGE_UPLOAD,
    guidelines: 'Upload your passport',
    required: false,
  };
  const idRequirements = {
    minimumRequired: 1,
    supportedDocuments: [supportedDocument],
  };
  const organisation: OrganisationModel = {
    organisationId,
    name: 'Org1',
    active: true,
    employmentStatus: [EmploymentStatus.EMPLOYED],
    employedIdRequirements: idRequirements,
    retiredIdRequirements: idRequirements,
    volunteerIdRequirements: idRequirements,
    trustedDomains: [],
  };
  const employer: EmployerModel = {
    organisationId,
    employerId,
    name: 'Employer1',
    active: true,
    employmentStatus: [EmploymentStatus.EMPLOYED],
  };
  const emailChange: EmailChangeModel = {
    currentEmail: 'email@example.com',
    newEmail: 'newemail@example.com',
  };
  const noteId = uuidv4();
  const note: NoteModel = {
    noteId,
    category: 'General',
    text: 'Test note',
    source: NoteSource.ADMIN,
    pinned: false,
  };
  const tokenSet: TokenSet = {
    access_token: 'accessToken',
    expires_in: 3600,
    id_token: 'idToken',
    token_type: 'Bearer',
  };

  let profileRepositoryMock: jest.Mocked<ProfileRepository>;
  let organisationServiceMock: jest.Mocked<OrganisationService>;
  let auth0ClientMock: jest.Mocked<Auth0ClientService>;
  let emailClientMock: jest.Mocked<EmailService>;
  let profileService: ProfileService;

  beforeEach(() => {
    profileRepositoryMock = new ProfileRepository() as jest.Mocked<ProfileRepository>;
    organisationServiceMock = new OrganisationService() as jest.Mocked<OrganisationService>;
    auth0ClientMock = new Auth0ClientService() as jest.Mocked<Auth0ClientService>;
    emailClientMock = new EmailService() as jest.Mocked<EmailService>;
    profileService = new ProfileService(
      profileRepositoryMock,
      organisationServiceMock,
      auth0ClientMock,
      emailClientMock,
    );
  });

  describe('createProfile', () => {
    it('should create a profile successfully', async () => {
      profileRepositoryMock.createProfile.mockResolvedValue(memberId);
      const result = await profileService.createProfile(profile);
      expect(result).toBe(memberId);
      expect(profileRepositoryMock.createProfile).toHaveBeenCalledWith(profile);
    });

    it('should throw an error if profile creation fails', async () => {
      profileRepositoryMock.createProfile.mockRejectedValue(new Error('Creation failed'));
      await expect(profileService.createProfile(profile)).rejects.toThrow('Creation failed');
    });
  });

  describe('updateProfile', () => {
    it('should update a profile successfully', async () => {
      organisationServiceMock.getOrganisation.mockResolvedValue(organisation);
      organisationServiceMock.getEmployer.mockResolvedValue(employer);
      await profileService.updateProfile(memberId, profile);
      expect(profileRepositoryMock.updateProfile).toHaveBeenCalledWith(memberId, profile);
    });

    it('should throw an error if organisation does not exist', async () => {
      organisationServiceMock.getOrganisation.mockRejectedValue(
        new NotFoundError('Organisation not found'),
      );
      await expect(profileService.updateProfile(memberId, profile)).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if employer does not exist', async () => {
      organisationServiceMock.getOrganisation.mockResolvedValue(organisation);
      organisationServiceMock.getEmployer.mockRejectedValue(
        new NotFoundError('Employer not found'),
      );
      await expect(profileService.updateProfile(memberId, profile)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getProfiles', () => {
    it('should fetch profiles successfully', async () => {
      const profiles = [profile];
      profileRepositoryMock.getProfiles.mockResolvedValue(profiles);
      const result = await profileService.getProfiles();
      expect(result).toBe(profiles);
    });

    it('should throw an error if fetching profiles fails', async () => {
      profileRepositoryMock.getProfiles.mockRejectedValue(new Error('Fetch failed'));
      await expect(profileService.getProfiles()).rejects.toThrow('Fetch failed');
    });
  });

  describe('getProfile', () => {
    it('should fetch a profile successfully', async () => {
      profileRepositoryMock.getProfile.mockResolvedValue(profile);
      const result = await profileService.getProfile(memberId);
      expect(result).toBe(profile);
    });

    it('should throw an error if fetching profile fails', async () => {
      profileRepositoryMock.getProfile.mockRejectedValue(new Error('Fetch failed'));
      await expect(profileService.getProfile(memberId)).rejects.toThrow('Fetch failed');
    });
  });

  describe('changeEmail', () => {
    it('should change email successfully', async () => {
      await profileService.changeEmail(memberId, emailChange);
      expect(auth0ClientMock.changeEmail).toHaveBeenCalledWith(memberId, emailChange.newEmail);
    });

    it('should throw an error if changing email fails', async () => {
      auth0ClientMock.changeEmail.mockRejectedValue(new Error('Change failed'));
      await expect(profileService.changeEmail(memberId, emailChange)).rejects.toThrow(
        'Change failed',
      );
    });
  });

  describe('sendEmailChangeRequest', () => {
    it('should throw an error if user is not found', async () => {
      profileRepositoryMock.getProfile.mockRejectedValue(new Error('repository Error'));

      await expect(
        profileService.sendEmailChangeRequest('123', 'current@example.com', 'new@example.com'),
      ).rejects.toThrow('repository Error');
    });

    it('should throw an error if current email does not match', async () => {
      profileRepositoryMock.getProfile.mockResolvedValue(profile);

      await expect(
        profileService.sendEmailChangeRequest('123', 'random@email.com', 'new@example.com'),
      ).rejects.toThrow(
        'Error sending change email: email in payload does not match current email does not match',
      );
    });

    it('should log an error and throw if sendEmailChangeRequest fails', async () => {
      profileRepositoryMock.getProfile.mockResolvedValue(profile);
      emailClientMock.sendEmailChangeRequest.mockRejectedValue(new Error('SES error'));

      await expect(
        profileService.sendEmailChangeRequest('123', profile.email, 'new@example.com'),
      ).rejects.toThrow('SES error');
    });

    it('should send an email change request successfully', async () => {
      profileRepositoryMock.getProfile.mockResolvedValue(profile);
      await profileService.sendEmailChangeRequest('123', profile.email, 'new@example.com');
      expect(emailClientMock.sendEmailChangeRequest).toHaveBeenCalledWith('new@example.com');
    });
  });

  describe('changePassword', () => {
    it('should throw validation error when entered email does not match profile', async () => {
      const passwordChange = passwordChangeModel('not.john.doe@example.com');
      profileRepositoryMock.getProfile.mockResolvedValue(profile);

      await expect(profileService.changePassword(memberId, passwordChange)).rejects.toThrow(
        'Email address does not match',
      );
    });

    it('should throw an error if changing password fails', async () => {
      const passwordChange = passwordChangeModel();
      const auth0Id = 'auth0|12345';
      profileRepositoryMock.getProfile.mockResolvedValue(profile);
      auth0ClientMock.authenticateUserWithPassword.mockResolvedValue(tokenSet);
      auth0ClientMock.getUserIdByEmail.mockResolvedValue(auth0Id);
      auth0ClientMock.changePassword.mockRejectedValue(new Error('Change failed'));

      await expect(profileService.changePassword(memberId, passwordChange)).rejects.toThrow(
        'Change failed',
      );
    });

    it('should change password successfully', async () => {
      const passwordChange = passwordChangeModel();
      const auth0Id = 'auth0|12345';
      profileRepositoryMock.getProfile.mockResolvedValue(profile);
      auth0ClientMock.authenticateUserWithPassword.mockResolvedValue(tokenSet);
      auth0ClientMock.getUserIdByEmail.mockResolvedValue(auth0Id);

      await profileService.changePassword(memberId, passwordChange);
      expect(auth0ClientMock.changePassword).toHaveBeenCalledWith(
        auth0Id,
        passwordChange.newPassword,
      );
    });
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      await profileService.createNote(memberId, note);
      expect(profileRepositoryMock.createNote).toHaveBeenCalledWith(memberId, note);
    });

    it('should throw an error if creating note fails', async () => {
      profileRepositoryMock.createNote.mockRejectedValue(new Error('Creation failed'));
      await expect(profileService.createNote(memberId, note)).rejects.toThrow('Creation failed');
    });
  });

  describe('getNotes', () => {
    it('should fetch notes successfully', async () => {
      const notes = [note];
      profileRepositoryMock.getNotes.mockResolvedValue(notes);
      const result = await profileService.getNotes(memberId);
      expect(result).toBe(notes);
    });

    it('should throw an error if fetching notes fails', async () => {
      profileRepositoryMock.getNotes.mockRejectedValue(new Error('Fetch failed'));
      await expect(profileService.getNotes(memberId)).rejects.toThrow('Fetch failed');
    });
  });

  describe('documentUploadComplete', () => {
    it('should record document upload successfully', async () => {
      await profileService.documentUploadComplete(memberId, 'key');
      expect(profileRepositoryMock.updateProfile).toHaveBeenCalledWith(memberId, {
        idUploaded: true,
      });
      expect(profileRepositoryMock.createNote).toHaveBeenCalledWith(
        memberId,
        expect.objectContaining({ category: 'ID Uploaded' }),
      );
    });

    it('should throw an error if recording document upload fails', async () => {
      profileRepositoryMock.updateProfile.mockRejectedValue(new Error('Update failed'));
      await expect(profileService.documentUploadComplete(memberId, 'key')).rejects.toThrow(
        'Update failed',
      );
    });
  });

  const passwordChangeModel = (
    email?: string,
    currentPassword?: string,
    newPassword?: string,
  ): PasswordChangeModel => {
    return {
      email: email ? email : 'john.doe@example.com',
      currentPassword: currentPassword ? currentPassword : 'password',
      newPassword: newPassword ? newPassword : 'newPassword',
    };
  };
});
