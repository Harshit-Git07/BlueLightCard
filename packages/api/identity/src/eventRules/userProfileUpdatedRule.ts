export const userProfileUpdatedRule = (userPoolId: string, dlqUrl: string, table: string) => ({
    userProfileUpdatedRule: {
        pattern: { 
            source: ['user.profile.updated']
        },
        targets: {
            userProfileUpdateFunction: {
                function: {
                    permissions: [ "dynamodb:Query", "dynamodb:UpdateItem", "sqs:SendMessage"],
                    handler: 'packages/api/identity/src/user-management/syncProfileUpdate.handler',
                    environment: { 
                        USER_POOL_ID: userPoolId, 
                        SERVICE: 'identity',
                        DLQ_URL: dlqUrl,
                        TABLE_NAME: table 
                    },
                    retryAttepmts: 0
                }
            }
       },
    }
});
