export const cardStatusUpdatedRule = (dlqUrl: string, table: string) => ({
    cardStatusUpdatedRule: {
        pattern: {source: ["user.card.status.updated"]},
        targets: {
          cardStatusUpdatedFunction : {
              function: {
                  permissions: ["sqs:SendMessage", "dynamodb:PutItem", "dynamodb:Query"],
                  handler: "packages/api/identity/src/card-management/syncStatusUpdate.handler",
                  environment: {
                      SERVICE: 'identity',  
                      DLQ_URL: dlqUrl,
                      TABLE_NAME: table 
                   },
                  retryAttepmts: 0
              }
          }
        }
      }
});