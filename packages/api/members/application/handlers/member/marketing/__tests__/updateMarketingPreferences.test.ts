import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import MarketingService from '@blc-mono/members/application/services/marketingService';

jest.mock('@blc-mono/members/application/services/marketingService');

describe('updateMarketingPreferences handler', () => {
  const memberId = uuidv4();
  const environment = 'web';
  const event = {
    pathParameters: { memberId, environment },
    body: JSON.stringify({ preferences: 'some-preferences' }),
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    MarketingService.prototype.updatePreferences = jest.fn().mockResolvedValue({});
  });

  it('should return 400 if memberId or environment is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if environment is invalid', async () => {
    const event = {
      pathParameters: { memberId, environment: 'invalid' },
    } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {
      pathParameters: { memberId, environment },
    } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 on successful update', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../updateMarketingPreferences')).handler(event, context);
}
