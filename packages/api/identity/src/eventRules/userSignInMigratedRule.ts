export const userSignInMigratedRule = (userPoolId: string, dlqUrl: string, table: string) => ({
    userSignInMigratedRule: {
        pattern: { 
            source: ['user.signin.migrated']
        },
        targets: {
            userSignInMigrationFunction: {
                function: {
                    permissions: ["sqs:SendMessage", "dynamodb:PutItem"],
                    handler: 'packages/api/identity/src/cognito/migrateUserProfileAndCardData.handler',
                    environment: { 
                        USER_POOL_ID: userPoolId, 
                        SERVICE: 'identity',
                        DLQ_URL: dlqUrl,
                        TABLE_NAME: table 
                    },
                    retryAttempts: 0
                }
            }
       },
    }
});
