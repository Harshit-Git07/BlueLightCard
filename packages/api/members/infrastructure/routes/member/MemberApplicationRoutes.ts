import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ApplicationModel,
  CreateApplicationModel,
  CreateApplicationModelResponse,
  UpdateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import { PromoCodeResponseModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { DocumentUploadLocation } from '@blc-mono/shared/models/members/documentUpload';

export function memberApplicationRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'POST /members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberCreateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/createApplication.handler',
      requestModelType: CreateApplicationModel,
      responseModelType: CreateApplicationModelResponse,
    }),
    'PUT /members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/updateApplication.handler',
      requestModelType: UpdateApplicationModel,
    }),
    'GET /members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetApplications',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplications.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplication.handler',
      responseModelType: ApplicationModel,
    }),
    'POST /members/{memberId}/applications/{applicationId}/uploadDocument': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUploadDocument',
      handler:
        'packages/api/members/application/handlers/member/applications/uploadDocument.handler',
      responseModelType: DocumentUploadLocation,
    }),
    'POST /members/{memberId}/applications/{applicationId}/code/validate/{promoCode}':
      Route.createRoute({
        ...defaultRouteProps,
        name: 'ValidatePromoCode',
        handler:
          'packages/api/members/application/handlers/member/applications/validatePromoCode.handler',
        responseModelType: PromoCodeResponseModel,
      }),
    'PUT /members/{memberId}/applications/{applicationId}/code/apply': Route.createRoute({
      ...defaultRouteProps,
      name: 'ApplyPromoCode',
      handler:
        'packages/api/members/application/handlers/member/applications/applyPromoCode.handler',
      responseModelType: UpdateApplicationModel,
    }),
  };
}
