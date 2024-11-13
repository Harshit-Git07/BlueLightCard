import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { memberProfileCustomerCreateRepository } from '../repositories/memberProfileCustomerCreateRepository';
import { AddressInsertPayload, CreateProfilePayload } from '../types/memberProfilesTypes';

export class memberProfileCustomerCreateService {
  constructor(
    private repository: memberProfileCustomerCreateRepository,
    private logger: Logger,
  ) {}

  async createCustomerProfiles(payload: CreateProfilePayload): Promise<string> {
    try {
      const memberUuid = await this.repository.createCustomerProfiles(payload);
      this.logger.info({
        message: `Profile created successfully: memberUuid: ${memberUuid}`,
      });
      return memberUuid;
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
      await this.repository.insertAddressAndUpdateProfile(memberKey, payload);
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
}
