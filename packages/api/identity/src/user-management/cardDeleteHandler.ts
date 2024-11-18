import { Logger } from '@aws-lambda-powertools/logger';
import { sendToDLQ } from '../../src/helpers/DLQ';
import { EventBridgeEvent } from 'aws-lambda';
import { CardRepository } from '../repositories/cardRepository';
import { Response } from '../../../core/src/utils/restResponse/response';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const identityTableName = getEnv(IdentityStackEnvironmentKeys.IDENTITY_TABLE_NAME);
const region = getEnv(IdentityStackEnvironmentKeys.REGION);
const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-deleteCard`,
  logLevel: logLevel,
});

export const handler = async (event: EventBridgeEvent<any, any>) => {
  logger.info('event received', { event });

  if (!event.detail) {
    logger.error('event detail is missing', { event });
  }
  const input = event.detail as Input;
  const cardRepository = new CardRepository(identityTableName, region);

  if(!input) {
   logger.error('event detail is missing', { event });
   return Response.BadRequest({ message: 'Please provide event details' });
  }

  if (input.uuid === undefined || input.uuid === '' || input.cardNumber === undefined || input.cardNumber === '') {
    logger.error('required parameters are missing');
    return Response.BadRequest({ message: 'Required parameters are missing' });
  }
  const uuid = input.uuid;
  const legacyCardId = input.cardNumber;

  try {
    const results = await cardRepository.deleteCard(uuid, legacyCardId);
    logger.debug('results', { results });
    return Response.OK({ message: 'success'});
  } catch (err: any) {
    logger.error('error deleting company follows', { err });
    await sendToDLQ(event);
  }
};

type Input = {
  cardNumber: string;
  uuid: string;
};
