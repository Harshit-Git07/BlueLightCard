import { Role } from "aws-cdk-lib/aws-iam";

export const cardStatusUpdatedRule = (dlqUrl: string, identityTable: string, region: string, role: Role) => ({
  cardStatusUpdatedRule: {
    pattern: { source: ["user.card.status.updated"] },
    targets: {
      cardStatusUpdatedFunction: {
        function: {
          role,
          handler: "packages/api/identity/src/card-management/syncStatusUpdate.handler",
          environment: {
            SERVICE: 'identity',
            DLQ_URL: dlqUrl,
            IDENTITY_TABLE_NAME: identityTable,
            REGION: region
          },
          retryAttempts: 0
        }
      }
    }
  }
});
