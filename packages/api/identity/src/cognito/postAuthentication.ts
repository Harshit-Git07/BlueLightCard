import { Logger } from '@aws-lambda-powertools/logger';
import { PostAuthenticationTriggerEvent } from 'aws-lambda';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-postAuthentication` });

export const handler = async (event: PostAuthenticationTriggerEvent, context: any) => {
  logger.info('audit', {
    audit: true,
    action: 'signin',
    memberId: event.request.userAttributes['custom:blc_old_id'],
    clientId: event.callerContext.clientId,
  });
  return event;
};
