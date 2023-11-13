export const userSignInMigratedRule = (dlqUrl: string, table: string, idMappingTable: string) => ({
    userSignInMigratedRule: {
        pattern: { 
            source: ['user.signin.migrated','user.signup']
        },
        targets: {
            userSignInMigrationFunction: {
                function: {
                    permissions: ["sqs:SendMessage", "dynamodb:PutItem", "dynamodb:Query"],
                    handler: 'packages/api/identity/src/cognito/migrateUserProfileAndCardData.handler',
                    environment: { 
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
