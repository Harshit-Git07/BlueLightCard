import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { PaymentModel } from '@blc-mono/members/application/models/paymentModel';
import { RefundModel } from '@blc-mono/members/application/models/refundModel';
import { Function } from 'sst/constructs';
import { MemberStackEnvironmentKeys } from '../../constants/environment';

export function adminPaymentRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  const singleAdminPaymentsHandler = new Function(
    defaultRouteProps.stack,
    'AdminPaymentsHandlerFunction',
    {
      bind: defaultRouteProps.bind,
      permissions: defaultRouteProps.permissions,
      handler: 'packages/api/members/application/handlers/admin/payment/paymentsHandler.handler',
      environment: {
        [MemberStackEnvironmentKeys.SERVICE]: 'members',
        ...defaultRouteProps.environment,
        [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(
          defaultRouteProps.defaultAllowedOrigins,
        ),
      },
      vpc: defaultRouteProps.vpc,
    },
  );

  return {
    'POST /admin/payments/initiate': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminInitiatePayment',
      requestModelType: PaymentModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
    'POST /admin/payments/checkout': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCompletePayment',
      requestModelType: PaymentModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
    'POST /admin/payments/refund/{transactionId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminRefundPayment',
      requestModelType: RefundModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
    'GET /admin/payments/history/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminPaymentHistory',
      requestModelType: PaymentModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
  };
}
