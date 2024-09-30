import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { Cron, Stack } from 'sst/constructs';

import { DiscoveryStackConfig } from '@blc-mono/discovery/infrastructure/config/config';

import { CronJobIDs } from '../constants/cronJobIDs';

const EVERY_HOUR_AT_15_MINUTES_PAST = 'cron(15 * * * ? *)';

export function setupOffersIndexCron(
  stack: Stack,
  openSearchOffersTable: TableV2,
  vpc: IVpc,
  openSearchDomainEndpoint: string,
  config: DiscoveryStackConfig,
  serviceName: string,
): Cron {
  return new Cron(stack, CronJobIDs.BUILD_OFFERS_INDEX, {
    job: {
      function: {
        permissions: ['dynamodb:Query', openSearchOffersTable.tableName],
        handler: 'packages/api/discovery/application/handlers/search/populateSearchIndex.handler',
        environment: {
          OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint ?? openSearchDomainEndpoint,
          STAGE: process.env.STAGE ?? '',
          OPENSEARCH_REGION: stack.region ?? '',
          OPENSEARCH_INDEX_SERVICE: serviceName,
          OPENSEARCH_INDEX_ENVIRONMENT: stack.stage ?? '',
          SEARCH_OFFER_COMPANY_TABLE_NAME: config.searchOfferCompanyTable ?? openSearchOffersTable.tableName,
        },
        vpc,
        deadLetterQueueEnabled: true,
        timeout: '5 minutes',
      },
    },
    schedule: EVERY_HOUR_AT_15_MINUTES_PAST,
    enabled: false,
  });
}
