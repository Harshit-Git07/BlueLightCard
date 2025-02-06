import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ApplicationModel,
  CreateApplicationModel,
  CreateApplicationModelResponse,
} from '@blc-mono/shared/models/members/applicationModel';
import { PromoCodeResponseModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { DocumentUploadLocation } from '@blc-mono/shared/models/members/documentUpload';
import { Function } from 'sst/constructs';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export function memberApplicationRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
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
    'POST /members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberCreateApplication',
      requestModelType: CreateApplicationModel,
      responseModelType: CreateApplicationModelResponse,
    }),
    'PUT /members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberUpdateApplication',
    }),
    'GET /members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberGetApplications',
      responseModelType: ApplicationModel,
    }),
    'GET /members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberGetApplication',
      responseModelType: ApplicationModel,
    }),
    'POST /members/{memberId}/applications/{applicationId}/uploadDocument': Route.createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'MemberUploadDocument',
      responseModelType: DocumentUploadLocation,
    }),
    'POST /members/{memberId}/applications/{applicationId}/code/validate/{promoCode}':
      Route.createRoute({
        ...defaultRouteProps,
        handlerFunction,
        name: 'ValidatePromoCode',
        responseModelType: PromoCodeResponseModel,
      }),
    'PUT /members/{memberId}/applications/{applicationId}/code/apply': Route.createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'ApplyPromoCode',
    }),
    'PUT /members/{memberId}/applications/{applicationId}/paymentConfirmed': Route.createRoute({
      ...defaultRouteProps,
      handlerFunction,
      name: 'PaymentConfirmed',
    }),
    'POST /members/{memberId}/applications/{applicationId}/resendTrustedDomainEmail':
      Route.createRoute({
        ...defaultRouteProps,
        handlerFunction,
        name: 'ResendTrustedDomainEmail',
      }),
    'GET /members/{memberId}/applications/{applicationId}/verifyTrustedDomain/{trustedDomainVerificationUid}':
      Route.createRoute({
        ...defaultRouteProps,
        authorizer: undefined,
        handlerFunction,
        name: 'VerifyTrustedDomain',
      }),
  };
}
