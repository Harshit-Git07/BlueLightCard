import { APIGatewayEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../../core/src/utils/restResponse/response';
import { isNull } from 'lodash';
import { unpackJWT } from './unpackJWT';

import { UserService } from 'src/services/UserService';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);

const logger = new Logger({ serviceName: `${service}-user-crud` });
const tableName: string = getEnv(IdentityStackEnvironmentKeys.IDENTITY_TABLE_NAME);
const region: string = getEnvOrDefault(IdentityStackEnvironmentKeys.REGION, 'eu-west-2');

const userService = new UserService(tableName, region, logger);

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.debug('input', { event });
  let authorization_header = '';

  if (event.headers.Authorization != undefined || event.headers.Authorization != '') {
    authorization_header = event.headers.Authorization ?? '';
  }

  let jwtInfo = unpackJWT(authorization_header);

  try {
    const userDetails = await userService.findUserDetails(jwtInfo['custom:blc_old_uuid']);

    if (isNull(userDetails)) {
      return Response.NotFound({ message: 'User not found' });
    }

    return Response.OK({ message: 'User Found', data: userDetails });
  } catch (error) {
    logger.error('error while fetching user details ', { error });
    return Response.Error(error as Error);
  }
};
