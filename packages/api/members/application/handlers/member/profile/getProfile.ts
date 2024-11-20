import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ProfileModel> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  verifyMemberHasAccessToProfile(event, memberId);
  return await service.getProfile(memberId);
};

export const handler = middleware(unwrappedHandler);
