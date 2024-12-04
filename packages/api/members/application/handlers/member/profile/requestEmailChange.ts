import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { EmailChangeModel } from '@blc-mono/members/application/models/emailChangeModel';
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

  verifyMemberHasAccessToProfile(event, memberId);
  const change = EmailChangeModel.parse(JSON.parse(event.body));
  await service.sendEmailChangeRequest(memberId, change.currentEmail, change.newEmail);
};

export const handler = middleware(unwrappedHandler);
