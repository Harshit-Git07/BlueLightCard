export const userSignInMigratedRule = (userPoolId: string, dlqUrl: string, table: string, idMappingTable: string) => ({
    userSignInMigratedRule: {
        pattern: { 
            source: ['user.signin.migrated']
        },
        targets: {
            userSignInMigrationFunction: {
                function: {
                    permissions: ["sqs:SendMessage", "dynamodb:PutItem", "dynamodb:Query"],
                    handler: 'packages/api/identity/src/cognito/migrateUserProfileAndCardData.handler',
                    environment: { 
                        USER_POOL_ID: userPoolId, 
                        SERVICE: 'identity',
                        DLQ_URL: dlqUrl,
                        TABLE_NAME: table,
                        ID_MAPPING_TABLE_NAME: idMappingTable
                    },
                    retryAttempts: 0
                }
            }
       },
    }
});
