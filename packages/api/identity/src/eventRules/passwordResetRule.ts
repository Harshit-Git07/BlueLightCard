import { Role } from "aws-cdk-lib/aws-iam";

export const passwordResetRule = (userPoolId: string, dlqUrl: string, ddsUserPoolId: string, region: string, tableName: string, oldUserPoolId: string, oldDdsUserPoolId: string, role: Role) => ({
  passwordResetRule: {
    pattern: { source: ["user.password.change.requested"] },
    targets: {
      passwordResetFunction: {
        function: {
          role: role,
          handler: "packages/api/identity/src/cognito/deleteCognitoUser.handler",
          environment: {
            USER_POOL_ID: userPoolId,
            USER_POOL_ID_DDS: ddsUserPoolId,
            OLD_USER_POOL_ID: oldUserPoolId,
            OLD_USER_POOL_ID_DDS: oldDdsUserPoolId,
            SERVICE: 'identity',
            DLQ_URL: dlqUrl,
            REGION: region,
            TABLE_NAME: tableName
          },
          retryAttepmts: 0
        }
      }
    }
  }
});
