import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { Tables } from '../../constructs/tables';

export const companyRule = (tables: Tables, queue: IQueue) => ({
  companyRule: {
    pattern: { source: ['company.create', 'company.update', 'company.delete'] },
    targets: {
      companyFunction: {
        function: {
          permissions: [
            'sqs:SendMessage',
            'dynamodb:PutItem',
            'dynamodb:DeleteItem',
            'dynamodb:Query',
            'dynamodb:TransactWriteItems',
          ],
          handler: 'packages/api/offers/src/eventBridge/lambdas/company.handler',
          environment: {
            SERVICE: 'offers',
            CATEGORY_TABLE_NAME: tables.categoryTable.tableName,
            TAG_TABLE_NAME: tables.tagsTable.tableName,
            COMPANY_TABLE_NAME: tables.companyTable.tableName,
            COMPANY_BRAND_CONNECTION_TABLE: tables.companyBrandConnectionTable.tableName,
            COMPANY_CATEGORY_CONNECTION_TABLE: tables.companyCategoryConnectionTable.tableName,
            COMPANY_TAG_CONNECTION_TABLE: tables.companyTagConnectionTable.tableName,
          },
          deadLetterQueueEnabled: true,
          deadLetterQueue: queue,
          retryAttempts: 1,
        },
      },
    },
  },
});
