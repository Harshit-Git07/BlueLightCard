export const passwordResetRule = (userPoolId: string, dlqUrl: string, ddsUserPoolId: string, region: string) => ({
    passwordResetRule: {
        pattern: {source: ["user.password.change.requested"]},
        targets: {
            passwordResetFunction : {
              function: {
                  permissions: ["cognito-idp:AdminDeleteUser", "cognito-idp:AdminGetUser", "sqs:SendMessage"],
                  handler: "packages/api/identity/src/cognito/deleteCognitoUser.handler",
                  environment: {
                      USER_POOL_ID: userPoolId,
                      USER_POOL_ID_DDS: ddsUserPoolId,
                      SERVICE: 'identity',
                      DLQ_URL: dlqUrl,
                      REGION: region
                    },
                    retryAttepmts: 0
              }
          }
        }
      }
});