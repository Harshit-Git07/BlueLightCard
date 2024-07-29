import { Role } from "aws-cdk-lib/aws-iam";

export const userProfileUpdatedRule = (dlqUrl: string, table: string, idMappingTable: string, region: string, role: Role) => ({
    userProfileUpdatedRule: {
        pattern: { 
            source: ['user.profile.updated']
        },
        targets: {
            userProfileUpdateFunction: {
                function: {
                  role,
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
