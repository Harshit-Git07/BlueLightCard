import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { CreateProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { PasswordChangeModel } from '@blc-mono/shared/models/members/passwordChangeModel';
import { EmailChangeModel } from '@blc-mono/shared/models/members/emailChangeModel';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { NoteModel } from '@blc-mono/shared/models/members/noteModel';
import { NoteSource } from '@blc-mono/shared/models/members/enums/NoteSource';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { TokenSet } from 'auth0';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { Auth0ClientService } from '@blc-mono/members/application/services/auth0/auth0ClientService';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';

jest.mock('@blc-mono/members/application/repositories/profileRepository');
jest.mock('@blc-mono/members/application/services/organisation/organisationService');
jest.mock('@blc-mono/members/application/services/auth0/auth0ClientService');

describe('ProfileService', () => {
  const memberId = '7d92ad80-8691-4fc7-839a-715384a8a5e0';
  const organisationId = '9d2632fb-8983-4f09-bfa1-f652b17e9ca1';
  const employerId = '9d2632fb-8691-4f09-bfa1-f652b17e9ca1';
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
    trustedDomains: [],
  };
  const emailChange: EmailChangeModel = {
    currentEmail: 'email@example.com',
    newEmail: 'newemail@example.com',
  };
  const noteId = '9d2632fb-8691-839a-bfa1-f652b17e9ca1';
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
  let profileService: ProfileService;

  beforeEach(() => {
    profileRepositoryMock = new ProfileRepository() as jest.Mocked<ProfileRepository>;
    organisationServiceMock = new OrganisationService() as jest.Mocked<OrganisationService>;
    auth0ClientMock = new Auth0ClientService() as jest.Mocked<Auth0ClientService>;
    profileService = new ProfileService(
      profileRepositoryMock,
      organisationServiceMock,
      auth0ClientMock,
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
