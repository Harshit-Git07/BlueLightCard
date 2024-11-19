import { Role } from 'aws-cdk-lib/aws-iam';

export const cardCreateRule = (
  dlqUrl: string,
  identityTable: string,
  idMappingTable: string,
  region: string,
  role: Role,
) => ({
  cardCreateRule: {
    pattern: {
      source: ['user.card.status.created'],
    },
    targets: {
      cardCreatedFunction: {
        function: {
          role,
          handler: 'packages/api/identity/src/user-management/cardCreateHandler.handler',
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
