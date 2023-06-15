export const emailUpdateRule = (userPoolId: string, dlqUrl: string) => ({
    emailUpdateRule: {
        pattern: {source: ["user.email.change.requested"]},
        targets: {
          emailUpdateFunction : {
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