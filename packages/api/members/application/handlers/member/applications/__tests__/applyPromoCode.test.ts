import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';
import { UpdateApplicationModel } from '@blc-mono/members/application/models/applicationModel';

jest.mock('@blc-mono/members/application/services/promoCodesService');

describe('applyPromoCode handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const context = {} as Context;

  beforeEach(() => {
    PromoCodesService.prototype.applyPromoCode = jest.fn();
  });

  it('should return 400 if required parameters are missing', async () => {
    const event = { pathParameters: { memberId } } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body does not includes promo code', async () => {
    const response = await handler(
      eventWithApplication({
        address1: '123 Example Street',
      }),
      context,
    );
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(
      eventWithApplication({
        promoCode: 'NHS12345',
        promoCodeApplied: true,
      }),
      context,
    );
    expect(response.statusCode).toEqual(204);
  });

  const eventWithApplication = (applicationModel: UpdateApplicationModel): APIGatewayProxyEvent => {
    return {
      pathParameters: { memberId, applicationId },
      body: JSON.stringify(applicationModel),
    } as any as APIGatewayProxyEvent;
  };
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../applyPromoCode')).handler(event, context);
}
