import { Role } from "aws-cdk-lib/aws-iam";

export const emailUpdateRule = (userPoolId: string, dlqUrl: string, ddsUserPoolId: string, region: string, unsuccessfulLoginAttemptsTableName: string, oldUserPoolId: string, oldDdsUserPoolId: string, role: Role) => ({
  emailUpdateRule: {
    pattern: { source: ["user.email.updated"] },
    targets: {
      emailUpdateFunction: {
        function: {
          role,
          handler: "packages/api/identity/src/cognito/deleteCognitoUser.handler",
          environment: {
            USER_POOL_ID: userPoolId,
            USER_POOL_ID_DDS: ddsUserPoolId,
            OLD_USER_POOL_ID: oldUserPoolId,
            OLD_USER_POOL_ID_DDS: oldDdsUserPoolId,
            SERVICE: 'identity',
            DLQ_URL: dlqUrl,
            REGION: region,
            UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME: unsuccessfulLoginAttemptsTableName
          },
          retryAttempts: 0
        }
      }
    }
  }
});
