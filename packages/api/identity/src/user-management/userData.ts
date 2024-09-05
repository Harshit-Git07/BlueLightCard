import { APIGatewayEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../../core/src/utils/restResponse/response';
import { unpackJWT } from './unpackJWT';
import { UserService } from '../../src/services/UserService';
import { isNull } from 'lodash';

const service: string = process.env.service as string;
const tableName: string = process.env.identityTableName ?? "";
const region: string = process.env.REGION ?? 'eu-west-2';

const logger = new Logger({ serviceName: `${service}-user-crud` });

const userService = new UserService(tableName, region,logger);

export const get = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.debug('input', { event });
  let authorization_header = "";
  
  if (event.headers.Authorization != undefined || event.headers.Authorization != "") {
    authorization_header = event.headers.Authorization??""
  }

  let jwtInfo = unpackJWT(authorization_header);

  try {
    const userDetails = await userService.findUserDetails(jwtInfo['custom:blc_old_uuid']);

    if(isNull(userDetails)) {
      return Response.NotFound({ message: 'User not found' });
    }
    
    return Response.OK({ message: 'User Found', data: userDetails });

  } catch (error) {
    logger.error('error while fetching user details ',{error});
    return Response.Error(error as Error);
  }
};
