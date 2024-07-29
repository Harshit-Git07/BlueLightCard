import { Role } from "aws-cdk-lib/aws-iam";

export const companyFollowsUpdatedRule = (dlqUrl: string, table: string, idMappingTable: string, region: string, role: Role)=> ({
    companyFollowsUpdatedRule: {
        pattern: {source: ["user.company.follows.updated"]},
        targets: {
            companyFollowsUpdatedFunction : {
              function: {
                role,
                  handler: "packages/api/identity/src/user-management/companyFollowsUpdate.handler",
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
        }
      }
});
