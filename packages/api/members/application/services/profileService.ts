import { logger } from '../middleware';
import { EmailChangeModel } from '../models/emailChangeModel';
import { NoteModel } from '../models/noteModel';
import { PasswordChangeModel } from '../models/passwordChangeModel';
import { CreateProfileModel, ProfileModel, UpdateProfileModel } from '../models/profileModel';
import { ProfileRepository } from '../repositories/profileRepository';
import { Auth0Client } from '../auth0/auth0Client';
import { OrganisationService } from './organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository = new ProfileRepository(),
    private readonly organisationService: OrganisationService = new OrganisationService(),
    private readonly auth0Client: Auth0Client = new Auth0Client(),
  ) {}

  async createProfile(profile: CreateProfileModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating profile', profile });
      return await this.repository.createProfile(profile);
    } catch (error) {
      logger.error({ message: 'Error creating profile', error });
      throw error;
    }
  }

  async updateProfile(profile: UpdateProfileModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating profile', profile });
      await this.verifyEmployerExists(profile);
      return await this.repository.updateProfile(profile.memberId, profile);
    } catch (error) {
      logger.error({ message: 'Error updating profile', error });
      throw error;
    }
  }

  private async verifyEmployerExists(profile: UpdateProfileModel): Promise<void> {
    if (profile.organisationId) {
      const organisation = await this.organisationService.getOrganisation(profile.organisationId);
      if (!organisation) {
        throw new ValidationError('Organisation not found');
      }
    }

    if (profile.organisationId && profile.employerId) {
      const employer = await this.organisationService.getEmployer(
        profile.organisationId,
        profile.employerId,
      );
      if (!employer) {
        throw new ValidationError('Employer not found');
      }
    }
  }

  async getProfiles(): Promise<ProfileModel[]> {
    try {
      logger.debug({ message: 'Fetching profiles' });
      return await this.repository.getProfiles();
    } catch (error) {
      logger.error({ message: 'Error fetching profiles', error });
      throw error;
    }
  }

  async getProfile(memberId: string): Promise<ProfileModel> {
    try {
      logger.debug({ message: 'Fetching profile', memberId });
      return await this.repository.getProfile(memberId);
    } catch (error) {
      logger.error({ message: 'Error fetching profile', error });
      throw error;
    }
  }

  async changeEmail(memberId: string, change: EmailChangeModel): Promise<void> {
    try {
      logger.debug({ message: 'Changing email', memberId });
      await this.auth0Client.changeEmail(memberId, change.newEmail);
    } catch (error) {
      logger.error({ message: 'Error changing email', error });
      throw error;
    }
  }

  async changePassword(memberId: string, change: PasswordChangeModel): Promise<void> {
    try {
      logger.debug({ message: 'Changing password', memberId });
      await this.auth0Client.changeEmail(memberId, change.newPassword);
    } catch (error) {
      logger.error({ message: 'Error changing password', error });
      throw error;
    }
  }

  async createNote(memberId: string, note: NoteModel): Promise<void> {
    try {
      logger.debug({ message: 'Creating note', note });
      await this.repository.createNote(memberId, note);
    } catch (error) {
      logger.error({ message: 'Error creating note', error });
      throw error;
    }
  }

  async getNotes(memberId: string): Promise<NoteModel[]> {
    try {
      logger.debug({ message: 'Fetching notes' });
      return await this.repository.getNotes(memberId);
    } catch (error) {
      logger.error({ message: 'Error fetching notes', error });
      throw error;
    }
  }

  async documentUploadComplete(memberId: string, key: string): Promise<void> {
    try {
      logger.debug({ message: 'Recording document upload' });
      await this.repository.updateProfile(memberId, {
        idUploaded: true,
      });

      await this.repository.createNote(memberId, {
        category: 'ID Uploaded',
        message: `ID document uploaded successfully on ${new Date().toISOString()}`,
      });
    } catch (error) {
      logger.error({ message: 'Error recording document upload', error });
      throw error;
    }
  }
}
