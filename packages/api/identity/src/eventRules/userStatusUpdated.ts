export const userStatusUpdatedRule = (userPoolId: string, dlqUrl: string, ddsUserPoolId: string) => ({
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
                    permissions: ["cognito-idp:AdminDeleteUser", "cognito-idp:AdminGetUser", "sqs:SendMessage"],
                    handler: 'packages/api/identity/src/cognito/deleteCognitoUser.handler',
                    environment: { 
                        USER_POOL_ID: userPoolId, 
                        USER_POOL_ID_DDS: ddsUserPoolId,
                        SERVICE: 'identity',
                        DLQ_URL: dlqUrl 
                    },
                    retryAttepmts: 0
                }
            }
       },
    }
});
