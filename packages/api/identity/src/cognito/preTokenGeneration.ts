import { Logger } from '@aws-lambda-powertools/logger';
import { PreTokenGenerationTriggerEvent } from 'aws-lambda';
import { PreTokenGenerateService } from 'src/services/PreTokenGenerateService';
import { ProfileService } from 'src/services/ProfileService';
import * as amplitude from '@amplitude/analytics-node';
import EVENTS from '@blc-mono/core/types/events';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const IDENTITY_TABLE_NAME = getEnv(IdentityStackEnvironmentKeys.IDENTITY_TABLE_NAME);
const REGION = getEnvOrDefault(IdentityStackEnvironmentKeys.REGION, 'eu-west-2');
const AMPLITUDE_API_KEY = getEnv(IdentityStackEnvironmentKeys.AMPLITUDE_API_KEY);
const POOL_INFO = getEnv(IdentityStackEnvironmentKeys.POOL_INFO);
const logger = new Logger({ serviceName: `${service}-preTokenGeneration` });

const preTokenGenerateService = new PreTokenGenerateService(IDENTITY_TABLE_NAME, REGION, logger);
const profile = new ProfileService(IDENTITY_TABLE_NAME, REGION);

export const handler = async (event: PreTokenGenerationTriggerEvent, context: any) => {
  logger.info('audit', {
    audit: true,
    action: event.triggerSource,
    memberId:
      event.triggerSource === 'TokenGeneration_Authentication' ||
      event.triggerSource === 'TokenGeneration_HostedAuth' ||
      event.triggerSource === 'TokenGeneration_RefreshTokens'
        ? event.request.userAttributes['custom:blc_old_id']
        : event.request.userAttributes['custom:blc_old_uuid'],
    clientId: event.callerContext.clientId,
  });
  const eventProperties = {
    memberId: event.request.userAttributes['custom:blc_old_id'],
    clientId: event.callerContext.clientId,
    source: event.triggerSource,
    pool: POOL_INFO,
  };
  const eventName =
    event.triggerSource === 'TokenGeneration_RefreshTokens'
      ? EVENTS.REFRESH_TOKEN_LOGIN
      : EVENTS.LOGIN_SUCCESS;
  try {
    amplitude.init(AMPLITUDE_API_KEY, {
      serverZone: amplitude.Types.ServerZone.EU,
    });
    const response = amplitude.track(eventName, eventProperties, {
      user_id: event.request.userAttributes['custom:blc_old_uuid'],
    }).promise;
    logger.info('auditLoginEvents', {
      audit: true,
      action: 'logLoginTypeEvents',
      eventProperties,
      response,
    });
  } catch (e) {
    logger.error('failed to track event', { e });
  }

  const uuid = event.request.userAttributes['custom:blc_old_uuid'];
  const latestCardData = await preTokenGenerateService.findLatestCard(uuid);
  const data = await profile.getData(uuid);

  let cardStatus = '';
  let cardNumber = '';
  if (latestCardData && latestCardData.cardStatus) {
    cardStatus = latestCardData.cardStatus;
    cardNumber = latestCardData.cardId;
  }
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        card_status: cardStatus,
        card_number: cardNumber,
        firstname: data.firstname ?? '',
        surname: data.surname ?? '',
      },
    },
  };

  return event;
};
