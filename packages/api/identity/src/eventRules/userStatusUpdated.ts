export const userStatusUpdatedRule = (userPoolId: string, dlqUrl: string, ddsUserPoolId: string, region: string, tableName: string) => ({
    userStatusUpdatedRule: {
        pattern: { 
            source: ['user.status.updated'],
            detail: {
                userStatus: [2,8]
            }
        },
        targets: {
            userStatusUpdateFunction: {
                function: {
                    permissions: ["cognito-idp:AdminDeleteUser", "cognito-idp:AdminGetUser", "sqs:SendMessage", "dynamodb:DeleteItem"],
                    handler: 'packages/api/identity/src/cognito/deleteCognitoUser.handler',
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
       },
    }
});
