import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/members/application/models/profileModel';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const profile = UpdateProfileModel.parse(JSON.parse(event.body));
  verifyMemberHasAccessToProfile(event, memberId);
  await service.updateProfile(memberId, profile);
};

export const handler = middleware(unwrappedHandler);
