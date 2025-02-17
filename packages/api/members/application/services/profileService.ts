import { EmailChangeModel } from '@blc-mono/shared/models/members/emailChangeModel';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';
import {
  CreateNoteModel,
  NoteModel,
  UpdateNoteModel,
} from '@blc-mono/shared/models/members/noteModel';
import { PasswordChangeModel } from '@blc-mono/shared/models/members/passwordChangeModel';
import {
  CreateProfileModel,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/shared/models/members/profileModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { Auth0ClientService } from '@blc-mono/members/application/services/auth0/auth0ClientService';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';

let profileServiceSingleton: ProfileService;

export class ProfileService {
  constructor(
    private readonly profileRepository = new ProfileRepository(),
    private readonly organisationService = new OrganisationService(),
    private readonly auth0Client = new Auth0ClientService(),
  ) {}

  async createProfile(profile: CreateProfileModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating profile', profile });
      return await this.profileRepository.createProfile(profile);
    } catch (error) {
      logger.error({ message: 'Error creating profile', error });
      throw error;
    }
  }

  async deleteProfile(memberId: string): Promise<void> {
    try {
      logger.debug({ message: 'Deleting profile', memberId });
      await this.profileRepository.deleteProfile(memberId);
    } catch (error) {
      logger.error({ message: 'Error deleting profile', error });
      throw error;
    }
  }

  async updateProfile(memberId: string, profile: UpdateProfileModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating profile', profile });
      await this.verifyEmployerExists(profile);
      return await this.profileRepository.updateProfile(memberId, profile);
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
      return await this.profileRepository.getProfiles();
    } catch (error) {
      logger.error({ message: 'Error fetching profiles', error });
      throw error;
    }
  }

  async getProfile(memberId: string): Promise<ProfileModel> {
    try {
      logger.debug({ message: 'Fetching profile', memberId });
      return await this.profileRepository.getProfile(memberId);
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
    const profile = await this.getProfile(memberId);
    if (profile.email !== change.email) {
      throw new ValidationError('Email address does not match');
    }

    const tokenSet = await this.auth0Client.authenticateUserWithPassword(
      profile.email,
      change.currentPassword,
    );
    if (!tokenSet) {
      throw new ValidationError('Failed to authenticate user on auth0');
    }

    const memberAuth0Id = await this.auth0Client.getUserIdByEmail(profile.email);

    try {
      if (memberAuth0Id) {
        logger.debug({ message: 'Changing password', memberId });
        await this.auth0Client.changePassword(memberAuth0Id, change.newPassword);
      }
    } catch (error) {
      logger.error({ message: 'Error changing password', error });
      throw error;
    }
  }

  async createNote(memberId: string, note: CreateNoteModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating note', note });
      return await this.profileRepository.createNote(memberId, note);
    } catch (error) {
      logger.error({ message: 'Error creating note', error });
      throw error;
    }
  }

  async updateNote(memberId: string, noteId: string, note: UpdateNoteModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating note', note });
      await this.profileRepository.updateNote(memberId, noteId, note);
    } catch (error) {
      logger.error({ message: 'Error updating note', error });
      throw error;
    }
  }

  async getNotes(memberId: string): Promise<NoteModel[]> {
    try {
      logger.debug({ message: 'Fetching notes' });
      return await this.profileRepository.getNotes(memberId);
    } catch (error) {
      logger.error({ message: 'Error fetching notes', error });
      throw error;
    }
  }
}

export function profileService(): ProfileService {
  if (!profileServiceSingleton) {
    profileServiceSingleton = new ProfileService();
  }

  return profileServiceSingleton;
}
