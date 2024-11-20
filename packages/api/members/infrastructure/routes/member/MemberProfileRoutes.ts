import { Route, RouteOptions } from '@blc-mono/members/infrastructure/routes/route';
import { Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { EmailChangeModel } from '@blc-mono/members/application/models/emailChangeModel';
import { PasswordChangeModel } from '@blc-mono/members/application/models/passwordChangeModel';
import {
  CreateProfileModel,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/members/application/models/profileModel';

export function memberProfileRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
  memberProfilesTable: Table,
  memberOrganisationsTable: Table,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
    bind: [memberProfilesTable, memberOrganisationsTable],
  };

  return {
    'POST /members/profiles': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberCreateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/createProfile.handler',
      requestModel: apiGatewayModelGenerator.generateModel(CreateProfileModel),
    }),
    'PUT /members/profiles': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberUpdateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/updateProfile.handler',
      requestModel: apiGatewayModelGenerator.generateModel(UpdateProfileModel),
    }),
    'GET /members/profiles/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetProfile',
      handler: 'packages/api/members/application/handlers/member/profile/getProfile.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ProfileModel),
    }),
    'PUT /members/profiles/{memberId}/email': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberChangeEmail',
      handler: 'packages/api/members/application/handlers/member/profile/changeEmail.handler',
      requestModel: apiGatewayModelGenerator.generateModel(EmailChangeModel),
    }),
    'PUT /members/profiles/{memberId}/password': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberChangePassword',
      handler: 'packages/api/members/application/handlers/member/profile/changePassword.handler',
      requestModel: apiGatewayModelGenerator.generateModel(PasswordChangeModel),
    }),
  };
}
