import { Role } from "aws-cdk-lib/aws-iam";

export const userSignInMigratedRule = (dlqUrl: string, identityTableName: string, idMappingTable: string, region: string, role: Role) => ({
  userSignInMigratedRule: {
    pattern: {
      source: ["user.signin.migrated", "user.signup"]
    },
    targets: {
      userSignInMigrationFunction: {
        function: {
          role,
          handler: "packages/api/identity/src/cognito/migrateUserProfileAndCardData.handler",
          environment: {
            SERVICE: 'identity',
            DLQ_URL: dlqUrl,
            IDENTITY_TABLE_NAME: identityTableName,
            ID_MAPPING_TABLE_NAME: idMappingTable,
            REGION: region
          },
          retryAttempts: 0
        }
      }
    },
  }
});
