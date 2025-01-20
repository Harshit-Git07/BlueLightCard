import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { UnauthorizedError } from '@blc-mono/members/application/errors/UnauthorizedError';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ProfileModel> => {
  const memberId = event.requestContext?.authorizer?.memberId;
  if (!memberId) {
    throw new UnauthorizedError('Could not determine Member ID from authentication context');
  }

  return await service.getProfile(memberId);
};

export const handler = middleware(unwrappedHandler);
