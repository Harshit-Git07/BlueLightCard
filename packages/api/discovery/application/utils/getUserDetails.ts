import { Logger } from '@aws-lambda-powertools/logger';
import { format, subYears } from 'date-fns';

import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';
import { UserModel } from '@blc-mono/identity/src/models/user';
import { UserService } from '@blc-mono/identity/src/services/UserService';

const logger = new Logger({ serviceName: `discover-get-user-details` });

const tableName: string = getEnv(DiscoveryStackEnvironmentKeys.IDENTITY_TABLE_NAME);
const region: string = getEnvOrDefault(DiscoveryStackEnvironmentKeys.REGION, 'eu-west-2');

const userService = new UserService(tableName, region, logger);

/**
 * Get user details from the user service
 * Lightweight wrapper for discovery stack to retrieve user details using identity user service
 * @param memberId
 * @returns
 */
export const getUserDetails = async (memberId: string) => {
  const userDetails = await userService.findUserDetails(memberId);
  const userProfile = userDetails?.profile as UserModel | undefined;
  if (!userProfile) return;
  if (!userProfile.dob) {
    return {
      organisation: userProfile.organisation,
      dob: format(subYears(new Date(), 17), 'yyyy-MM-dd'),
    };
  }
  return {
    organisation: userProfile.organisation,
    dob: userProfile.dob,
  };
};
