import { logger } from '../middleware';
import { EmailChangeModel } from '../models/emailChangeModel';
import { CreateNoteModel, NoteModel, UpdateNoteModel } from '../models/noteModel';
import { PasswordChangeModel } from '../models/passwordChangeModel';
import { CreateProfileModel, ProfileModel, UpdateProfileModel } from '../models/profileModel';
import { ProfileRepository } from '../repositories/profileRepository';
import { Auth0ClientService } from '../auth0/auth0ClientService';
import { OrganisationService } from './organisationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { NoteSource } from '../models/enums/NoteSource';
import { EmailService } from '../email/emailService';

export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository = new ProfileRepository(),
    private readonly organisationService: OrganisationService = new OrganisationService(),
    private readonly auth0Client: Auth0ClientService = new Auth0ClientService(),
    private readonly emailClient: EmailService = new EmailService(),
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

  async updateProfile(memberId: string, profile: UpdateProfileModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating profile', profile });
      await this.verifyEmployerExists(profile);
      return await this.repository.updateProfile(memberId, profile);
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

  async sendEmailChangeRequest(memberId: string, currentEmail: string, newEmail: string) {
    const member = await this.getProfile(memberId);
    if (member.email !== currentEmail) {
      throw new ValidationError(
        'Error sending change email: email in payload does not match current email does not match',
      );
    }
    try {
      await this.emailClient.sendEmailChangeRequest(newEmail);
    } catch (error) {
      logger.error({ message: 'Error sending changing email', error });
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

    if (tokenSet) {
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
  }

  async createNote(memberId: string, note: CreateNoteModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating note', note });
      return await this.repository.createNote(memberId, note);
    } catch (error) {
      logger.error({ message: 'Error creating note', error });
      throw error;
    }
  }

  async updateNote(memberId: string, noteId: string, note: UpdateNoteModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating note', note });
      await this.repository.updateNote(memberId, noteId, note);
    } catch (error) {
      logger.error({ message: 'Error updating note', error });
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
}
