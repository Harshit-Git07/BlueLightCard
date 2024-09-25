import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { EventBusRuleProps, Stack } from 'sst/constructs';

import { DiscoveryStackConfig } from '@blc-mono/discovery/infrastructure/config/config';

export const populateOpenSearchRule = (
  stack: Stack,
  vpc: IVpc,
  table: TableV2,
  openSearchDomainEndpoint: string,
  config: DiscoveryStackConfig,
  serviceName: string,
): EventBusRuleProps => ({
  pattern: { source: ['opensearch.populate.index'] },
  targets: {
    populateOpenSearchFunction: {
      function: {
        permissions: ['dynamodb:Query', table.tableName],
        handler: 'packages/api/discovery/application/handlers/search/populateSearchIndex.handler',
        environment: {
          OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint ?? openSearchDomainEndpoint,
          STAGE: process.env.STAGE ?? '',
          OPENSEARCH_REGION: stack.region ?? '',
          OPENSEARCH_INDEX_SERVICE: serviceName,
          OPENSEARCH_INDEX_ENVIRONMENT: stack.stage ?? '',
          SEARCH_OFFER_COMPANY_TABLE_NAME: table.tableName ?? '',
        },
        vpc,
        deadLetterQueueEnabled: true,
        timeout: '5 minutes',
      },
    },
  },
});
