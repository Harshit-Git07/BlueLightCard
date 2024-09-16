import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from './../../../core/src/utils/restResponse/response';
import { BRANDS } from './../../../core/src/types/brands.enum';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { sendToDLQ } from 'src/helpers/DLQ';
import { CardService } from 'src/services/CardService';

const tableName = getEnv(IdentityStackEnvironmentKeys.IDENTITY_TABLE_NAME);

const cardService = new CardService(
  `${tableName}`,
  getEnv(IdentityStackEnvironmentKeys.REGION),
);
const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-syncCardStatusUpdate`,
  logLevel: logLevel,
});

export const handler = async (event: any, context: any) => {
  logger.debug('event received', event);
  const brand = event.detail !== undefined || event.detail !== null ? event.detail.brand?.toUpperCase() : null;
  if (brand == null) {
    logger.debug('brand details missing', brand);
    return Response.BadRequest({ message: 'Please provide brand details' });
  }

  if (!(brand in BRANDS)) {
    logger.debug('invalid brand', brand);
    return Response.BadRequest({ message: 'Please provide a valid brand' });
  }

  if(await checkEventDetailsMissing(event)) {
    logger.debug('required parameters are missing', event);
    return Response.BadRequest({ message: 'Required parameters are missing' });
  }
  
  const uuid = event.detail.uuid;
  try {
    const userCurrentCardsresults = await cardService.getUserCurrentCard(event);
    try {
      const UpdateUsersCardresults = await cardService.updateUsersCard(userCurrentCardsresults, event)
      logger.debug('results', { UpdateUsersCardresults });
      return Response.OK({ message: `user card data updated` });
    } catch (err: any) {
      logger.error('error syncing user card data', { uuid, err });
      await sendToDLQ(event);
    }
  } catch (err: any) {
    logger.error('error querying user card data', { uuid, err });
    await sendToDLQ(event);
  }
};

function checkEventDetailsMissing(event: any) {
  return (event.detail.uuid === undefined ||
  event.detail.uuid === '' ||
  event.detail.cardNumber === undefined ||
  event.detail.cardNumber === '' ||
  event.detail.cardStatus === undefined)
}
