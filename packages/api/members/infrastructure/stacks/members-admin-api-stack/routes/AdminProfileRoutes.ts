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
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function adminProfileRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
  return {
    'GET /admin/members/profiles': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetProfiles',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfiles.handler',
      responseModelType: ProfileModel,
    }),
    'GET /admin/members/{memberId}/profile': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/getProfile.handler',
      responseModelType: ProfileModel,
    }),
    'POST /admin/members/profile': createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/createProfile.handler',
      requestModelType: AdminCreateProfileModel,
      responseModelType: CreateProfileModelResponse,
    }),
    'POST /admin/members/profiles': createRoute({
      ...defaultRouteProps,
      name: 'AdminBulkUpload',
      handler: 'packages/api/members/application/handlers/admin/profile/bulkUpload.handler',
    }),
    'PUT /admin/members/{memberId}/profile': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateProfile',
      handler: 'packages/api/members/application/handlers/admin/profile/updateProfile.handler',
      requestModelType: UpdateProfileModel,
    }),
    'PUT /admin/members/{memberId}/profile/email': createRoute({
      ...defaultRouteProps,
      name: 'AdminChangeEmail',
      handler: 'packages/api/members/application/handlers/admin/profile/changeEmail.handler',
      requestModelType: EmailChangeModel,
    }),
    'PUT /admin/members/{memberId}/profile/password': createRoute({
      ...defaultRouteProps,
      name: 'AdminChangePassword',
      handler: 'packages/api/members/application/handlers/admin/profile/changePassword.handler',
      requestModelType: PasswordChangeModel,
    }),
    'GET /admin/members/{memberId}/profile/notes': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetNotes',
      handler: 'packages/api/members/application/handlers/admin/profile/getNotes.handler',
      responseModelType: NoteModel,
    }),
    'POST /admin/members/{memberId}/profile/notes': createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateNote',
      handler: 'packages/api/members/application/handlers/admin/profile/createNote.handler',
      requestModelType: CreateNoteModel,
      responseModelType: CreateNoteModelResponse,
    }),
    'PUT /admin/members/{memberId}/profile/notes/{noteId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateNote',
      handler: 'packages/api/members/application/handlers/admin/profile/updateNote.handler',
      requestModelType: UpdateNoteModel,
    }),
  };
}
