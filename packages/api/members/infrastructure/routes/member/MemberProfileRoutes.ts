import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { EmailChangeModel } from '@blc-mono/members/application/models/emailChangeModel';
import { PasswordChangeModel } from '@blc-mono/members/application/models/passwordChangeModel';
import {
  CreateProfileModel,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/members/application/models/profileModel';

export function memberProfileRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'POST /members/profiles': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberCreateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/createProfile.handler',
      requestModelType: CreateProfileModel,
    }),
    'PUT /members/profiles': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/updateProfile.handler',
      requestModelType: UpdateProfileModel,
    }),
    'GET /members/profiles/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetProfile',
      handler: 'packages/api/members/application/handlers/member/profile/getProfile.handler',
      responseModelType: ProfileModel,
    }),
    'PUT /members/profiles/{memberId}/email': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberChangeEmail',
      handler: 'packages/api/members/application/handlers/member/profile/changeEmail.handler',
      requestModelType: EmailChangeModel,
    }),
    'PUT /members/profiles/{memberId}/password': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberChangePassword',
      handler: 'packages/api/members/application/handlers/member/profile/changePassword.handler',
      requestModelType: PasswordChangeModel,
    }),
  };
}
