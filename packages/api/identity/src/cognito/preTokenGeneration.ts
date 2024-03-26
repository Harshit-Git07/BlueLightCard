import {Logger} from "@aws-lambda-powertools/logger";
import { PreTokenGenerationTriggerEvent } from 'aws-lambda'
import { PreTokenGenerateService } from "src/services/PreTokenGenerateService";

const service: string = process.env.SERVICE as string
const TABLE_NAME = process.env.IDENTITY_TABLE_NAME ?? "";
const REGION = process.env.REGION ?? "eu-west-2";
const logger = new Logger({ serviceName: `${service}-preTokenGeneration`, logLevel: process.env.DEBUG_LOGGING_ENABLED ? 'DEBUG' : 'INFO' });

const preTokenGenerateService = new PreTokenGenerateService(TABLE_NAME, REGION, logger);

export const handler = async (event: PreTokenGenerationTriggerEvent, context: any) => {
  logger.info('audit', {
    audit: true,
    action: event.triggerSource,
    memberId : (event.triggerSource === 'TokenGeneration_Authentication' || event.triggerSource === 'TokenGeneration_HostedAuth' || event.triggerSource === 'TokenGeneration_RefreshTokens') ? event.request.userAttributes['custom:blc_old_id'] : event.request.userAttributes['custom:blc_old_uuid']
});

  const latestCardId = await preTokenGenerateService.findLatestCardStatus(event.request.userAttributes['custom:blc_old_uuid']);

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        card_status: latestCardId,
      },
    },
  };

  return event;
}
