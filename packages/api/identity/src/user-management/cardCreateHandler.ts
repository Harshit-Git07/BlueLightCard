import { Logger } from '@aws-lambda-powertools/logger';
import { sendToDLQ } from '../helpers/DLQ';
import { EventBridgeEvent } from 'aws-lambda';
import { CardRepository } from '../repositories/cardRepository';
import { Response } from '../../../core/src/utils/restResponse/response';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { getCardStatus } from '@blc-mono/core/utils/getCardStatus'

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const identityTableName = getEnv(IdentityStackEnvironmentKeys.IDENTITY_TABLE_NAME);
const region = getEnv(IdentityStackEnvironmentKeys.REGION);
const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-createCard`,
  logLevel: logLevel,
});

export const handler = async (event: EventBridgeEvent<any, any>) => {
  logger.info('event received', { event });

  if (!event.detail) {
    logger.error('event detail is missing', { event });
  }
  const inputData = event.detail as Input;

  if (!inputData) {
    logger.error('event detail is missing', { event });
    return Response.BadRequest({ message: 'Please provide event details' });
  }

  if (
    inputData.uuid === undefined ||
    inputData.uuid === '' ||
    inputData.cardNumber === undefined ||
    inputData.cardNumber === ''
  ) {
    logger.error('required parameters are missing');
    return Response.BadRequest({ message: 'Required parameters are missing' });
  }
  const uuid = inputData.uuid;
  const legacyCardId = inputData.cardNumber;
  const expires = inputData.expires;
  const status = inputData.cardStatus;
  const convertedStatus = getCardStatus(Number(status));

  const cardRepository = new CardRepository(identityTableName, region);
  try {
    const results = await cardRepository.createCard(uuid, legacyCardId, expires, convertedStatus);
    logger.debug('results', { results });
    return Response.OK({ message: 'success' });
  } catch (err: any) {
    logger.error('error inserting card', { err });
    await sendToDLQ(event);
  }
};

type Input = {
  cardNumber: string;
  uuid: string;
  expires: string;
  cardStatus: string;
};
