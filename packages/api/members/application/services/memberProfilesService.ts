import { Logger } from '@aws-lambda-powertools/logger';
import { MemberProfilesRepository } from '../repositories/memberProfilesRepository';
import {
  AddressInsertPayload,
  CardCreatePayload,
  ProfileUpdatePayload,
  CreateProfilePayload,
} from '../types/memberProfilesTypes';
import { MemberProfileApp, transformDBToApp } from '../models/memberProfileModel';

export class MemberProfilesService {
  constructor(
    private repository: MemberProfilesRepository,
    private logger: Logger,
  ) {}

  async createCustomerProfiles(payload: CreateProfilePayload, brand: string): Promise<string> {
    try {
      const memberUuid = await this.repository.createCustomerProfiles(payload, brand);
      this.logger.info('Profile created successfully', { memberUuid });
      return memberUuid;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error creating profile:', { error: error.message });
        throw error;
      } else {
        this.logger.error('Unknown error creating profile:', { error });
        throw new Error('Unknown error occurred while creating profile');
      }
    }
  }

  async getMemberProfiles(uuid: string): Promise<MemberProfileApp | null> {
    try {
      const dbProfile = await this.repository.getMemberProfiles(uuid);
      if (!dbProfile) {
        return null;
      }
      return transformDBToApp(dbProfile);
    } catch (error) {
      this.logger.error('Error processing member profile', {
        error,
        uuid,
      });
      throw new Error('Error processing member profile');
    }
  }

  async updateProfile(memberUUID: string, payload: ProfileUpdatePayload): Promise<void> {
    const memberKey = `MEMBER#${memberUUID}`;

    try {
      const profileSK = await this.getProfileSortKey(memberKey, memberUUID);
      await this.repository.updateProfile(memberKey, profileSK, payload);
      this.logger.info('Profile updated successfully', { memberUUID });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error updating profile:', { error: error.message });
        throw error;
      } else {
        this.logger.error('Unknown error updating profile:', { error });
        throw new Error('Unknown error occurred while updating profile');
      }
    }
  }

  async insertAddress(memberUUID: string, payload: AddressInsertPayload): Promise<void> {
    const memberKey = `MEMBER#${memberUUID}`;

    try {
      const profileSK = await this.getProfileSortKey(memberKey, memberUUID);
      await this.repository.insertAddressAndUpdateProfile(memberKey, profileSK, payload);
      this.logger.info('Address inserted and profile updated with county successfully', {
        memberUUID,
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error inserting address:', { error: error.message });
        throw error;
      } else {
        this.logger.error('Unknown error inserting address:', { error });
        throw new Error('Unknown error occurred while inserting address');
      }
    }
  }

  async createCard(memberUUID: string, payload: CardCreatePayload): Promise<void> {
    try {
      await this.repository.insertCard(memberUUID, payload.cardStatus);
    } catch (error) {
      this.logger.error('Error creating card:', {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred while creating card',
        memberUUID: memberUUID,
      });
      throw new Error('Failed to create card');
    }
  }

  private async getProfileSortKey(memberKey: string, memberUUID: string): Promise<string> {
    const profileSK = await this.repository.getProfileSortKey(memberKey);
    if (!profileSK) {
      this.logger.warn('Member profile not found: ', { memberUUID });
      throw new Error('Member profile not found');
    }
    return profileSK;
  }
}
