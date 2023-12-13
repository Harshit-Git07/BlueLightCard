import { Table } from 'sst/constructs';
import { Stack } from 'aws-cdk-lib';

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
