import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { profileService } from '@blc-mono/members/application/services/profileService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { EmailChangeModel } from '@blc-mono/shared/models/members/emailChangeModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { emailService } from '@blc-mono/members/application/services/email/emailService';

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
  const profile = await profileService().getProfile(memberId);
  if (profile.email !== change.currentEmail) {
    throw new ValidationError(
      'Error sending change email: email in payload does not match current email does not match',
    );
  }

  await emailService().sendEmailChangeRequest(change.newEmail);
};

export const handler = middleware(unwrappedHandler);
