import { Role } from 'aws-cdk-lib/aws-iam';

export const userProfileUpdatedRule = (
  dlqUrl: string,
  identityTable: string,
  idMappingTable: string,
  region: string,
  role: Role,
) => ({
  userProfileUpdatedRule: {
    pattern: {
      source: ['user.profile.updated'],
    },
    targets: {
      userProfileUpdateFunction: {
        function: {
          role,
          handler: 'packages/api/identity/src/user-management/syncProfileUpdateHandler.handler',
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
