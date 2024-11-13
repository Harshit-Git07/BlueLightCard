import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
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
      this.logger.info({
        message: `Profile created successfully: memberUuid: ${memberUuid} | profileUuid: ${profileUuid}`,
      });
      return [memberUuid, profileUuid];
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          message: 'Error creating profile:',
          error: error.message,
        });
        throw error;
      } else {
        this.logger.error({
          message: 'Unknown error creating profile:',
          error: JSON.stringify(error),
        });
        throw new Error('Unknown error occurred while creating profile');
      }
    }
  }

  async insertAddress(memberUUID: string, payload: AddressInsertPayload): Promise<void> {
    const memberKey = `MEMBER#${memberUUID}`;

    try {
      const profileSK = await this.getProfileSortKey(memberKey, memberUUID);
      await this.repository.insertAddressAndUpdateProfile(memberKey, profileSK, payload);
      this.logger.info({
        message: `Address inserted and profile updated with county successfully | memberUuid: ${memberUUID}`,
      });
    } catch (error) {
      this.logger.error({
        message: 'Error inserting address:',
        error: error instanceof Error ? error.message : 'Unknown error inserting address',
      });
      throw error;
    }
  }

  private async getProfileSortKey(memberKey: string, memberUUID: string): Promise<string> {
    const profileSK = await this.repository.getProfileSortKey(memberKey);
    if (!profileSK) {
      this.logger.warn({ message: `Member profile not found: memberUuid: ${memberUUID} ` });
      throw new Error('Member profile not found');
    }
    return profileSK;
  }
}
