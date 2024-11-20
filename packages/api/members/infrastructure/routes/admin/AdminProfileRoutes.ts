import { Route } from '@blc-mono/members/infrastructure/routes/route';
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
import { NoteModel } from '@blc-mono/members/application/models/noteModel';

export function adminProfileRoutes(
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
    'GET /admin/members/profiles': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetProfiles',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfiles.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ProfileModel),
    }),
    'GET /admin/members/profiles/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfile.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ProfileModel),
    }),
    'POST /admin/members/profiles': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminCreateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/createProfile.handler',
      requestModel: apiGatewayModelGenerator.generateModel(CreateProfileModel),
    }),
    'PUT /admin/members/profiles': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/updateProfile.handler',
      requestModel: apiGatewayModelGenerator.generateModel(UpdateProfileModel),
    }),
    'PUT /admin/members/profiles/{memberId}/email': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminChangeEmail',
      handler: 'packages/api/members/application/handlers/admin/profile/changeEmail.handler',
      requestModel: apiGatewayModelGenerator.generateModel(EmailChangeModel),
    }),
    'PUT /admin/members/profiles/{memberId}/password': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminChangePassword',
      handler: 'packages/api/members/application/handlers/admin/profile/changePassword.handler',
      requestModel: apiGatewayModelGenerator.generateModel(PasswordChangeModel),
    }),
    'GET /admin/members/profiles/{memberId}/notes': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetNotes',
      handler: 'packages/api/members/application/handlers/admin/profile/getNotes.handler',
      responseModel: apiGatewayModelGenerator.generateModel(NoteModel),
    }),
    'PUT /admin/members/profiles/{memberId}/notes': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateNotes',
      handler: 'packages/api/members/application/handlers/admin/profile/updateNotes.handler',
      requestModel: apiGatewayModelGenerator.generateModel(NoteModel),
    }),
    'POST /admin/members/profiles/bulk': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminBulkUpload',
      handler: 'packages/api/members/application/handlers/admin/profile/bulkUpload.handler',
    }),
  };
}
