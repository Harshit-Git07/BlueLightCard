import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { MarketingService } from '@blc-mono/members/application/services/marketingService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';

const service = new MarketingService();

const unwrappedHandler = async (event: APIGatewayProxyEvent) => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeUpdateModel.parse(JSON.parse(event.body));
  verifyMemberHasAccessToProfile(event, memberId);
  await service.updateBraze(memberId, model.attributes);
};

export const handler = middleware(unwrappedHandler);
