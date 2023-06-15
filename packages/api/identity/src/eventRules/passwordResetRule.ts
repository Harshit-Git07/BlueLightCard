export const passwordResetRule = (userPoolId: string, dlqUrl: string) => ({
    passwordResetRule: {
        pattern: {source: ["user.password.change.requested"]},
        targets: {
            passwordResetFunction : {
              function: {
                  permissions: ["cognito-idp:AdminDeleteUser", "sqs:SendMessage"],
                  handler: "packages/api/identity/src/cognito/deleteCognitoUser.handler",
                  environment: {
                      USER_POOL_ID: userPoolId,
                      SERVICE: 'identity',
                      DLQ_URL: dlqUrl 
                    },
                    retryAttepmts: 0
              }
          }
        }
      }
});