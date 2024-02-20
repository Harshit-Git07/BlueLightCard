export const userGdprRule = (userPoolId: string, dlqUrl: string, ddsUserPoolId: string, region: string, tableName: string) => ({
    userGdprRule: {
        pattern: {
            source: ["user.gdpr.requested"]
        },
        targets: {
            userGdprFunction : {
              function: {
                  permissions: ["cognito-idp:AdminDeleteUser", "cognito-idp:AdminGetUser", "sqs:SendMessage", "dynamodb:DeleteItem"],
                  handler: "packages/api/identity/src/cognito/deleteCognitoUser.handler",
                  environment: {
                      USER_POOL_ID: userPoolId,
                      USER_POOL_ID_DDS: ddsUserPoolId,
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