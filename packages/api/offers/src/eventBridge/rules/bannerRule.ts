import { IQueue } from 'aws-cdk-lib/aws-sqs';

export const bannerRule = (tableName: string, queue: IQueue, region: string) => ({
  bannerRule: {
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
