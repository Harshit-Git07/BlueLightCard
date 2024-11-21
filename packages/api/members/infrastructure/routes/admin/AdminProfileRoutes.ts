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
import { NoteModel } from '@blc-mono/members/application/models/noteModel';

export function adminProfileRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'GET /admin/members/profiles': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetProfiles',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfiles.handler',
      responseModelType: ProfileModel,
    }),
    'GET /admin/members/profiles/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfile.handler',
      responseModelType: ProfileModel,
    }),
    'POST /admin/members/profiles': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/createProfile.handler',
      requestModelType: CreateProfileModel,
    }),
    'PUT /admin/members/profiles': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/updateProfile.handler',
      requestModelType: UpdateProfileModel,
    }),
    'PUT /admin/members/profiles/{memberId}/email': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminChangeEmail',
      handler: 'packages/api/members/application/handlers/admin/profile/changeEmail.handler',
      requestModelType: EmailChangeModel,
    }),
    'PUT /admin/members/profiles/{memberId}/password': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminChangePassword',
      handler: 'packages/api/members/application/handlers/admin/profile/changePassword.handler',
      requestModelType: PasswordChangeModel,
    }),
    'GET /admin/members/profiles/{memberId}/notes': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetNotes',
      handler: 'packages/api/members/application/handlers/admin/profile/getNotes.handler',
      responseModelType: NoteModel,
    }),
    'PUT /admin/members/profiles/{memberId}/notes': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateNotes',
      handler: 'packages/api/members/application/handlers/admin/profile/updateNotes.handler',
      requestModelType: NoteModel,
    }),
    'POST /admin/members/profiles/bulk': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminBulkUpload',
      handler: 'packages/api/members/application/handlers/admin/profile/bulkUpload.handler',
    }),
  };
}
