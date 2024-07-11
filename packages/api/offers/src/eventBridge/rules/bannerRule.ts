import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { generateConstructId } from '@blc-mono/core/utils/generateConstuctId';

export const bannerRule = (tableName: string, queue: IQueue, stackName: string, region: string) => ({
  [`${generateConstructId('bannerRule', stackName)}`]: {
    pattern: { source: ['banner.created', 'banner.updated', 'banner.deleted'] },
    targets: {
      bannerFunction: {
        function: {
          permissions: ['sqs:SendMessage', 'dynamodb:PutItem', 'dynamodb:DeleteItem', 'dynamodb:Query'],
          handler: 'packages/api/offers/src/eventBridge/lambdas/banner.handler',
          environment: {
            SERVICE: 'offers',
            TABLE_NAME: tableName,
            REGION: region,
            CDN_URL: process.env.CDN_URL ?? 'https://cdn.bluelightcard.co.uk'
          },
          deadLetterQueueEnabled: true,
          deadLetterQueue: queue,
          retryAttempts: 0,
        },
      },
    },
  },
});
