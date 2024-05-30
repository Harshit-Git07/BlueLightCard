import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { unpackJWT } from '../../../core/src/utils/unpackJWT';
import { validateBearerToken } from './validateBearerToken';
import { z } from 'zod';

// Expand this model as and when more fields are needed
const DecodedTokenModel = z.object({
  "custom:blc_old_uuid": z.optional(z.string()),
  "custom:blc_old_id": z.optional(z.string()),
});


export function decodeJWT(token: string, logger: LambdaLogger) {
  if(!validateBearerToken(token)) {
    logger.error({ message: 'Authorization token not valid, missing Bearer prefix' })
    throw new Error('Authorization token not valid, missing Bearer prefix');
  }
  try {
    const decodedToken = DecodedTokenModel.parse(unpackJWT(token));
    return decodedToken;
  } catch (error: any) {
    logger.error({ message: 'Could not decode JWT', error: error});
    throw new Error('Authorization token not valid, missing uid');
  }
}
