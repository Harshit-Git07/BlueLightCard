import { Role } from 'aws-cdk-lib/aws-iam';

export const cardDeleteRule = (
  dlqUrl: string,
  identityTable: string,
  idMappingTable: string,
  region: string,
  role: Role,
) => ({
  cardDeleteRule: {
    pattern: {
      source: ['user.card.deleted'],
    },
    targets: {
      cardDeletedFunction: {
        function: {
          role,
          handler: 'packages/api/identity/src/user-management/cardDeleteHandler.handler',
          environment: {
            SERVICE: 'identity',
            DLQ_URL: dlqUrl,
            IDENTITY_TABLE_NAME: identityTable,
            ID_MAPPING_TABLE_NAME: idMappingTable,
            REGION: region,
          },
          retryAttempts: 0,
        },
      },
    },
  },
});
