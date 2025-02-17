import { EmailChangeModel } from '@blc-mono/shared/models/members/emailChangeModel';
import { PasswordChangeModel } from '@blc-mono/shared/models/members/passwordChangeModel';
import {
  CreateProfileModel,
  CreateProfileModelResponse,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/shared/models/members/profileModel';
import { MemberRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/types/memberRoutes';
import {
  DefaultRouteProps,
  createRoute,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function memberProfileRoutes(defaultRouteProps: DefaultRouteProps): MemberRoutes {
  return {
    'GET /members/profile': createRoute({
      ...defaultRouteProps,
      name: 'MemberGetProfileForAuthenticatedUser',
      handler:
        'packages/api/members/application/handlers/member/profile/getProfileForAuthenticatedUser.handler',
      responseModelType: ProfileModel,
    }),
    'GET /members/{memberId}/profile': createRoute({
      ...defaultRouteProps,
      name: 'MemberGetProfile',
      handler: 'packages/api/members/application/handlers/member/profile/getProfile.handler',
      responseModelType: ProfileModel,
    }),
    'POST /members/profile': createRoute({
      ...defaultRouteProps,
      name: 'MemberCreateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/createProfile.handler',
      requestModelType: CreateProfileModel,
      responseModelType: CreateProfileModelResponse,
      authorizer: 'none',
      apiKeyRequired: true,
    }),
    'PUT /members/{memberId}/profile': createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateProfile',
      handler: 'packages/api/members/application/handlers/member/profile/updateProfile.handler',
      requestModelType: UpdateProfileModel,
    }),
    'PUT /members/{memberId}/profile/email': createRoute({
      ...defaultRouteProps,
      name: 'MemberChangeEmailRequest',
      handler:
        'packages/api/members/application/handlers/member/profile/requestEmailChange.handler',
      requestModelType: EmailChangeModel,
      permissions: ['ses:SendEmail'],
    }),
    'PUT /members/{memberId}/profile/password': createRoute({
      ...defaultRouteProps,
      name: 'MemberChangePassword',
      handler: 'packages/api/members/application/handlers/member/profile/changePassword.handler',
      requestModelType: PasswordChangeModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
  };
}
