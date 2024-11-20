import { Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1Api, Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PaymentModel } from '@blc-mono/members/application/models/paymentModel';
import { RefundModel } from '@blc-mono/members/application/models/refundModel';

export function adminPaymentRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
  memberProfilesTable: Table,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
    bind: [memberProfilesTable],
  };

  return {
    'POST /admin/payments/initiate': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminInitiatePayment',
      handler: 'packages/api/members/application/handlers/admin/payment/initiatePayment.handler',
      requestModel: apiGatewayModelGenerator.generateModel(PaymentModel),
    }),
    'POST /admin/payments/checkout': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminCompletePayment',
      handler: 'packages/api/members/application/handlers/admin/payment/completePayment.handler',
      requestModel: apiGatewayModelGenerator.generateModel(PaymentModel),
    }),
    'POST /admin/payments/refund/{transactionId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminRefundPayment',
      handler: 'packages/api/members/application/handlers/admin/payment/refundPayment.handler',
      requestModel: apiGatewayModelGenerator.generateModel(RefundModel),
    }),
    'GET /admin/payments/history/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminPaymentHistory',
      handler: 'packages/api/members/application/handlers/admin/payment/paymentHistory.handler',
      requestModel: apiGatewayModelGenerator.generateModel(PaymentModel),
    }),
  };
}
