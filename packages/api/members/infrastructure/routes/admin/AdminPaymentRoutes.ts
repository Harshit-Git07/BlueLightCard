import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { PaymentModel } from '@blc-mono/members/application/models/paymentModel';
import { RefundModel } from '@blc-mono/members/application/models/refundModel';

export function adminPaymentRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<never>> {
  return {
    'POST /admin/payments/initiate': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminInitiatePayment',
      handler: 'packages/api/members/application/handlers/admin/payment/initiatePayment.handler',
      requestModelType: PaymentModel,
    }),
    'POST /admin/payments/checkout': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCompletePayment',
      handler: 'packages/api/members/application/handlers/admin/payment/completePayment.handler',
      requestModelType: PaymentModel,
    }),
    'POST /admin/payments/refund/{transactionId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminRefundPayment',
      handler: 'packages/api/members/application/handlers/admin/payment/refundPayment.handler',
      requestModelType: RefundModel,
    }),
    'GET /admin/payments/history/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminPaymentHistory',
      handler: 'packages/api/members/application/handlers/admin/payment/paymentHistory.handler',
      requestModelType: PaymentModel,
    }),
  };
}
