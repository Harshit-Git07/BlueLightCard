import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { EmailModel } from '@blc-mono/members/application/models/emailModel';

export function adminEmailRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'POST /admin/sendEmail': Route.createRoute({
      ...defaultRouteProps,
      environment: {
        EMAIL_SERVICE_BRAZE_API_KEY: process.env.EMAIL_SERVICE_BRAZE_API_KEY,
        EMAIL_SERVICE_BRAZE_VERIFICATION_CAMPAIGN_ID:
          process.env.EMAIL_SERVICE_BRAZE_VERIFICATION_CAMPAIGN_ID,
        EMAIL_SERVICE_AUTH0_LOGIN_URL: process.env.AUTH0_LOGIN_URL,
        EMAIL_SERVICE_BRAND: process.env.BRAND,
      },
      name: 'AdminSendEmail',
      handler: 'packages/api/members/application/handlers/admin/email/sendEmail.handler',
      requestModelType: EmailModel,
      permissions: ['ses:SendEmail', 's3:GetObject'],
    }),
  };
}
