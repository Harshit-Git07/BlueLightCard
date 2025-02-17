import {
  DefaultRouteProps,
  createRoute,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';
import {
  ApplicationModel,
  CreateApplicationModel,
  CreateApplicationModelResponse,
} from '@blc-mono/shared/models/members/applicationModel';
import { PromoCodeResponseModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { DocumentUploadLocation } from '@blc-mono/shared/models/members/documentUpload';
import { Function } from 'sst/constructs';
import { MemberRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/types/memberRoutes';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export function memberApplicationRoutes(defaultRouteProps: DefaultRouteProps): MemberRoutes {
  const handlerFunction = new Function(
    defaultRouteProps.stack,
    'MemberApplicationHandlerFunction',
    {
      bind: defaultRouteProps.bind,
      permissions: [...(defaultRouteProps.permissions ?? []), 'ses:SendEmail', 's3:GetObject'],
      handler:
        'packages/api/members/application/handlers/member/applications/memberApplicationHandler.handler',
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
    'GET /members/{memberId}/applications': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberGetApplications',
      responseModelType: ApplicationModel,
    }),
    'GET /members/{memberId}/applications/{applicationId}': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberGetApplication',
      responseModelType: ApplicationModel,
    }),
    'POST /members/{memberId}/applications': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberCreateApplication',
      requestModelType: CreateApplicationModel,
      responseModelType: CreateApplicationModelResponse,
    }),
    'PUT /members/{memberId}/applications/{applicationId}': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberUpdateApplication',
    }),
    'POST /members/{memberId}/applications/{applicationId}/uploadDocument': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberUploadDocument',
      responseModelType: DocumentUploadLocation,
    }),
    'POST /members/{memberId}/applications/{applicationId}/code/validate/{promoCode}': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'ValidatePromoCode',
      responseModelType: PromoCodeResponseModel,
    }),
    'PUT /members/{memberId}/applications/{applicationId}/code/apply': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'ApplyPromoCode',
    }),
    'PUT /members/{memberId}/applications/{applicationId}/paymentConfirmed': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'PaymentConfirmed',
    }),
    'POST /members/{memberId}/applications/{applicationId}/resendTrustedDomainEmail': createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'ResendTrustedDomainEmail',
    }),
    'GET /members/{memberId}/applications/{applicationId}/verifyTrustedDomain/{trustedDomainVerificationUid}':
      createRoute({
        ...defaultRouteProps,
        authorizer: 'none',
        handlerFunction,
        name: 'VerifyTrustedDomain',
      }),
  };
}
