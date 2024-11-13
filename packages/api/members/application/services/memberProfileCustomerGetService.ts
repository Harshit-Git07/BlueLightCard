import { MemberProfileCustomerGetRepository } from '../repositories/memberProfileCustomerGetRepository';
import { GetCustomerProfileQueryPayload } from '../types/customerProfileTypes';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { APIError } from '../models/APIError';
import { APIErrorCode } from '../enums/APIErrorCode';
import { CustomerProfileModel } from '../models/customer/customerProfileModel';

export class MemberProfileCustomerGetService {
  constructor(
    private readonly repository: MemberProfileCustomerGetRepository,
    private readonly logger: Logger,
  ) {}

  async getCustomerProfile({
    brand,
    memberUuid,
    profileUuid,
  }: GetCustomerProfileQueryPayload): Promise<{
    customerProfile: CustomerProfileModel | {};
    errorSet: APIError[];
  }> {
    const errorSet: APIError[] = [];
    let customerProfile: CustomerProfileModel | {} = {};
    try {
      customerProfile = await this.repository.getCustomerProfile({
        brand,
        memberUuid,
        profileUuid,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Member profile not found') {
          this.logger.error({
            message: `Error getting customer profile for ${memberUuid}: Customer not found`,
            error: error.message,
          });
          errorSet.push(
            new APIError(
              APIErrorCode.RESOURCE_NOT_FOUND,
              'getCustomerProfile',
              'Member profile not found',
            ),
          );
        } else {
          this.logger.error({
            message: `Error getting customer profile for ${memberUuid}`,
            error:
              error instanceof Error ? error.message : 'Unknown error getting customer profile',
          });
          errorSet.push(
            new APIError(APIErrorCode.GENERIC_ERROR, 'getCustomerProfile', error.message),
          );
        }
      } else {
        this.logger.error({
          message: `Unknown error occured getting customer profile for ${memberUuid}`,
          error: error instanceof Error ? error.message : 'Unknown error getting customer profile',
        });
        errorSet.push(
          new APIError(APIErrorCode.GENERIC_ERROR, 'getCustomerProfile', 'unknown error'),
        );
      }
    }
    return { customerProfile, errorSet };
  }
}
