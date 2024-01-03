import { Stack } from 'aws-cdk-lib';
import { Table } from 'sst/constructs';

export const CreateRedemptionConfigTable = (stack: Stack): Table =>
  new Table(stack, 'RedemptionConfigTable', {
    fields: {
      id: 'string',
      offerId: 'string',
    },
    primaryIndex: {
      partitionKey: 'id',
      sortKey: 'offerId',
    },
    globalIndexes: {
      offerId: {
        partitionKey: 'offerId',
      },
    },
  });
