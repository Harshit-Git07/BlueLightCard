import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { resolveGetOfferMenusByBrandId } from './s3Menus/resolveGetOfferMenusByBrandId';

const logger = new Logger({ serviceName: `queryLambdaResolver` });

const resolvers = new Map<string, (event: AppSyncResolverEvent<any>) => Promise<any>>([
  ['Query:getOfferMenusByBrandId', resolveGetOfferMenusByBrandId],
]);

export const handler = async (event: AppSyncResolverEvent<any>) => {
  logger.info('event', { event });
  const resolverKey = `${event.info.parentTypeName}:${event.info.fieldName}`;
  const resolver = resolvers.get(resolverKey);
  if (resolver) {
    return await resolver(event);
  } else {
    throw new Error(`No resolver defined for ${resolverKey}`);
  }
};
