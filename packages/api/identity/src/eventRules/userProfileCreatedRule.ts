export const userProfileCreatedRule = (userPoolId: string, dlqUrl: string, table: string) => ({
    userProfileCreatedRule: {
        pattern: { 
            source: ['user.profile.created']
        },
        targets: {
            userProfileCreateFunction: {
                function: {
                    permissions: [ "dynamodb:Query", "dynamodb:PutItem", "sqs:SendMessage"],
                    handler: 'packages/api/identity/src/user-management/createUserProfile.handler',
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
