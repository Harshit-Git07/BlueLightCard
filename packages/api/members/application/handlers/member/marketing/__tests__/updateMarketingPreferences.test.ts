import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { MarketingService } from '@blc-mono/members/application/services/marketingService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/marketingService');

describe('updateMarketingPreferences handler', () => {
  const memberId = uuidv4();
  const environment = 'web';
  const event = {
    pathParameters: { memberId, environment },
    body: JSON.stringify({ attributes: {} }),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    MarketingService.prototype.updateBraze = jest.fn().mockResolvedValue({});
  });

  it('should return 400 if memberId or environment is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if environment is invalid', async () => {
    const event = {
      pathParameters: { memberId, environment: 'invalid' },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {
      pathParameters: { memberId, environment },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../updateMarketingPreferences')).handler(event, emptyContextStub);
}
