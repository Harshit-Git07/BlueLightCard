import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import MarketingService from '@blc-mono/members/application/services/marketingService';
import { BrazeAttributesModel } from '@blc-mono/members/application/models/brazeAttributesModel';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new MarketingService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<Record<string, unknown>> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeAttributesModel.parse(JSON.parse(event.body));
  verifyMemberHasAccessToProfile(event, memberId);
  return await service.getAttributes(memberId, model.attributes);
};

export const handler = middleware(unwrappedHandler);
