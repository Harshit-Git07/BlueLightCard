import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ProfileModel> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  verifyMemberHasAccessToProfile(event, memberId);
  const profile = await service.getProfile(memberId);
  return {
    ...profile,
    cards: profile.cards && profile.cards.length > 0 ? [profile.cards[0]] : [],
  };
};

export const handler = middleware(unwrappedHandler);
