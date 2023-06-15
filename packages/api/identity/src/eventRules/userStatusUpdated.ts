export const userStatusUpdatedRule = (userPoolId: string, dlqUrl: string) => ({
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
                    permissions: ["cognito-idp:AdminDeleteUser", "sqs:SendMessage"],
                    handler: 'packages/api/identity/src/cognito/deleteCognitoUser.handler',
                    environment: { 
                        USER_POOL_ID: userPoolId, 
                        SERVICE: 'identity',
                        DLQ_URL: dlqUrl 
                    },
                    retryAttepmts: 0
                }
            }
       },
    }
});
