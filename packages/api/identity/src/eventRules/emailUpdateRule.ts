export const emailUpdateRule = (userPoolId: string, dlqUrl: string, ddsUserPoolId: string) => ({
    emailUpdateRule: {
        pattern: {source: ["user.email.change.requested"]},
        targets: {
          emailUpdateFunction : {
              function: {
                  permissions: ["cognito-idp:AdminDeleteUser", "cognito-idp:AdminGetUser", "sqs:SendMessage"],
                  handler: "packages/api/identity/src/cognito/deleteCognitoUser.handler",
                  environment: {
                      USER_POOL_ID: userPoolId,
                      USER_POOL_ID_DDS: ddsUserPoolId,
                      SERVICE: 'identity',  
                      DLQ_URL: dlqUrl 
                   },
                  retryAttepmts: 0
              }
          }
        }
      }
});