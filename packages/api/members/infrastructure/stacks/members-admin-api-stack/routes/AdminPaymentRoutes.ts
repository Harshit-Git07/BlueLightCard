import { Function } from 'sst/constructs';
import { PaymentModel } from '@blc-mono/shared/models/members/paymentModel';
import { RefundModel } from '@blc-mono/shared/models/members/refundModel';
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export function adminPaymentRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
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
    'GET /admin/payments/history/{memberId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminPaymentHistory',
      requestModelType: PaymentModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
    'POST /admin/payments/initiate': createRoute({
      ...defaultRouteProps,
      name: 'AdminInitiatePayment',
      requestModelType: PaymentModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
    'POST /admin/payments/checkout': createRoute({
      ...defaultRouteProps,
      name: 'AdminCompletePayment',
      requestModelType: PaymentModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
    'POST /admin/payments/refund/{transactionId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminRefundPayment',
      requestModelType: RefundModel,
      handlerFunction: singleAdminPaymentsHandler,
    }),
  };
}
