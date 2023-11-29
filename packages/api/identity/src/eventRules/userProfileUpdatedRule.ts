export const userProfileUpdatedRule = (dlqUrl: string, table: string, idMappingTable: string, region: string) => ({
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
                        SERVICE: 'identity',
                        DLQ_URL: dlqUrl,
                        TABLE_NAME: table,
                        ID_MAPPING_TABLE_NAME: idMappingTable,
                        REGION: region
                    },
                    retryAttepmts: 0
                }
            }
       },
    }
});
