import { Role } from "aws-cdk-lib/aws-iam";

export const cardStatusUpdatedRule = (dlqUrl: string, table: string, region: string, role: Role) => ({
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
            TABLE_NAME: table,
            REGION: region
          },
          retryAttepmts: 0
        }
      }
    }
  }
});
