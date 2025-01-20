import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import MarketingService from '@blc-mono/members/application/services/marketingService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/marketingService');

describe('getMarketingPreferences handler', () => {
  const memberId = uuidv4();
  const environment = 'web';
  const event = {
    pathParameters: { memberId, environment },
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    MarketingService.prototype.getPreferences = jest.fn().mockResolvedValue({});
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

  it('should return 200 on successful retrieval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../getMarketingPreferences')).handler(event, emptyContextStub);
}
