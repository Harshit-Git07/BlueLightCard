import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { EmailChangeModel } from '@blc-mono/members/application/models/emailChangeModel';
import { PasswordChangeModel } from '@blc-mono/members/application/models/passwordChangeModel';
import {
  CreateProfileModel,
  CreateProfileModelResponse,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/members/application/models/profileModel';

export function memberProfileRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'GET /members/profile': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetProfileForAuthenticatedUser',
      handler:
        'packages/api/members/application/handlers/member/profile/getProfileForAuthenticatedUser.handler',
      responseModelType: ProfileModel,
    }),
    'POST /members/profile': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberCreateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/createProfile.handler',
      requestModelType: CreateProfileModel,
      responseModelType: CreateProfileModelResponse,
      authorizer: 'none',
      apiKeyRequired: true,
    }),
    'PUT /members/{memberId}/profile': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/updateProfile.handler',
      requestModelType: UpdateProfileModel,
    }),
    'GET /members/{memberId}/profile': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetProfile',
      handler: 'packages/api/members/application/handlers/member/profile/getProfile.handler',
      responseModelType: ProfileModel,
    }),
    'PUT /members/{memberId}/profile/email': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberChangeEmailRequest',
      handler:
        'packages/api/members/application/handlers/member/profile/requestEmailChange.handler',
      requestModelType: EmailChangeModel,
      permissions: ['ses:SendEmail'],
    }),
    'PUT /members/{memberId}/profile/password': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberChangePassword',
      handler: 'packages/api/members/application/handlers/member/profile/changePassword.handler',
      requestModelType: PasswordChangeModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
  };
}
