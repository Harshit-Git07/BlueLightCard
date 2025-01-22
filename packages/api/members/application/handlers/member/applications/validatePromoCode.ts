import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/middleware';
import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';
import { PromoCodeResponseModel } from '@blc-mono/shared/models/members/promoCodeModel';

const service = new PromoCodesService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<PromoCodeResponseModel> => {
  const { memberId, promoCode } = event.pathParameters || {};
  if (!memberId || !promoCode) {
    throw new ValidationError('Member ID and promo code value are required');
  }

  return await service.validatePromoCode(memberId, promoCode);
};

export const handler = middleware(unwrappedHandler);
