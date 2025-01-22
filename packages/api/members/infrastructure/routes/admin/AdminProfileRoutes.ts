import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { EmailChangeModel } from '@blc-mono/shared/models/members/emailChangeModel';
import { PasswordChangeModel } from '@blc-mono/shared/models/members/passwordChangeModel';
import {
  AdminCreateProfileModel,
  CreateProfileModelResponse,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/shared/models/members/profileModel';
import {
  CreateNoteModel,
  CreateNoteModelResponse,
  NoteModel,
  UpdateNoteModel,
} from '@blc-mono/shared/models/members/noteModel';

export function adminProfileRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'GET /admin/members/profiles': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetProfiles',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfiles.handler',
      responseModelType: ProfileModel,
    }),
    'POST /admin/members/profiles': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminBulkUpload',
      handler: 'packages/api/members/application/handlers/admin/profile/bulkUpload.handler',
    }),
    'POST /admin/members/profile': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/createProfile.handler',
      requestModelType: AdminCreateProfileModel,
      responseModelType: CreateProfileModelResponse,
    }),
    'PUT /admin/members/{memberId}/profile': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/updateProfile.handler',
      requestModelType: UpdateProfileModel,
    }),
    'GET /admin/members/{memberId}/profile': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfile.handler',
      responseModelType: ProfileModel,
    }),
    'PUT /admin/members/{memberId}/profile/email': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminChangeEmail',
      handler: 'packages/api/members/application/handlers/admin/profile/changeEmail.handler',
      requestModelType: EmailChangeModel,
    }),
    'PUT /admin/members/{memberId}/profile/password': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminChangePassword',
      handler: 'packages/api/members/application/handlers/admin/profile/changePassword.handler',
      requestModelType: PasswordChangeModel,
    }),
    'GET /admin/members/{memberId}/profile/notes': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetNotes',
      handler: 'packages/api/members/application/handlers/admin/profile/getNotes.handler',
      responseModelType: NoteModel,
    }),
    'POST /admin/members/{memberId}/profile/notes': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateNote',
      handler: 'packages/api/members/application/handlers/admin/profile/createNote.handler',
      requestModelType: CreateNoteModel,
      responseModelType: CreateNoteModelResponse,
    }),
    'PUT /admin/members/{memberId}/profile/notes/{noteId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateNote',
      handler: 'packages/api/members/application/handlers/admin/profile/updateNote.handler',
      requestModelType: UpdateNoteModel,
    }),
  };
}
