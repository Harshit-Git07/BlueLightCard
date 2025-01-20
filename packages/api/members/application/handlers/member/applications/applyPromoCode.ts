import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/middleware';
import { UpdateApplicationModel } from '@blc-mono/members/application/models/applicationModel';

const service = new PromoCodesService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = UpdateApplicationModel.parse(JSON.parse(event.body));
  if (application.promoCode && application.promoCodeApplied) {
    return await service.applyPromoCode(
      memberId,
      applicationId,
      application.promoCode,
      application.promoCodeApplied,
    );
  } else {
    throw new ValidationError('Promo code and promo code applied values are required');
  }
};

export const handler = middleware(unwrappedHandler);
