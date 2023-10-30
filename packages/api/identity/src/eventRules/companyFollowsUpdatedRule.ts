export const companyFollowsUpdatedRule = (dlqUrl: string, table: string, idMappingTable: string)=> ({
    companyFollowsUpdatedRule: {
        pattern: {source: ["user.company.follows.updated"]},
        targets: {
            companyFollowsUpdatedFunction : {
              function: {
                  permissions: ["sqs:SendMessage", "dynamodb:PutItem", "dynamodb:Query", "dynamodb:DeleteItem"],
                  handler: "packages/api/identity/src/user-management/companyFollowsUpdate.handler",
                  environment: {
                      SERVICE: 'identity',
                      DLQ_URL: dlqUrl,
                      TABLE_NAME: table,
                      ID_MAPPING_TABLE_NAME: idMappingTable
                   },
                  retryAttepmts: 0
              }
          }
        }
      }
});