import { Role } from 'aws-cdk-lib/aws-iam';

export const companyFollowsUpdatedRule = (
  dlqUrl: string,
  identityTableName: string,
  idMappingTable: string,
  region: string,
  role: Role,
) => ({
  companyFollowsUpdatedRule: {
    pattern: { source: ['user.company.follows.updated'] },
    targets: {
      companyFollowsUpdatedFunction: {
        function: {
          role,
          handler: 'packages/api/identity/src/user-management/companyFollowsHandler.handler',
          environment: {
            SERVICE: 'identity',
            DLQ_URL: dlqUrl,
            IDENTITY_TABLE_NAME: identityTableName,
            ID_MAPPING_TABLE_NAME: idMappingTable,
            REGION: region,
          },
          retryAttempts: 0,
        },
      },
    },
  },
});
