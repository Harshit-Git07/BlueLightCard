import { Logger } from '@aws-lambda-powertools/logger';
import { memberProfileCustomerCreateRepository } from '../repositories/memberProfileCustomerCreateRepository';
import { AddressInsertPayload, CreateProfilePayload } from '../types/memberProfilesTypes';
import { MemberProfileApp, transformDBToApp } from '../models/memberProfilesModel';

export class memberProfileCustomerCreateService {
  constructor(
    private repository: memberProfileCustomerCreateRepository,
    private logger: Logger,
  ) {}

  async createCustomerProfiles(
    payload: CreateProfilePayload,
    brand: string,
  ): Promise<[string, string]> {
    try {
      const [memberUuid, profileUuid] = await this.repository.createCustomerProfiles(
        payload,
        brand,
      );
      this.logger.info('Profile created successfully', { memberUuid, profileUuid });
      return [memberUuid, profileUuid];
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

  private async getProfileSortKey(memberKey: string, memberUUID: string): Promise<string> {
    const profileSK = await this.repository.getProfileSortKey(memberKey);
    if (!profileSK) {
      this.logger.warn('Member profile not found: ', { memberUUID });
      throw new Error('Member profile not found');
    }
    return profileSK;
  }
}
