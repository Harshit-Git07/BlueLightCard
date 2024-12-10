import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';

jest.mock('@blc-mono/members/application/services/promoCodesService');

describe('validatePromoCode handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const promoCode = 'NHS12345';
  const event = {
    pathParameters: { memberId, applicationId, promoCode },
  } as any as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    PromoCodesService.prototype.validatePromoCode = jest.fn();
  });

  it('should return 400 if required parameters are missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful validation', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../validatePromoCode')).handler(event, context);
}
