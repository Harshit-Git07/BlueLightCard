import { EmailModel } from '@blc-mono/shared/models/members/emailModel';
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function adminEmailRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
  return {
    'POST /admin/sendEmail': createRoute({
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
