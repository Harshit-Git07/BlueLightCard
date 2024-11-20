import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import MarketingService from '@blc-mono/members/application/services/marketingService';
import { BrazeAttributesModel } from '@blc-mono/members/application/models/brazeAttributesModel';
import { verifyMemberHasAccessToProfile } from '../../memberAuthorization';

jest.mock('@blc-mono/members/application/services/marketingService');
jest.mock('../../memberAuthorization');

describe('getBrazeAttributes handler', () => {
  const memberId = uuidv4();
  const event = {
    pathParameters: { memberId },
    body: JSON.stringify({ attributes: 'some-attributes' }),
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    MarketingService.prototype.getAttributes = jest.fn().mockResolvedValue({});
    BrazeAttributesModel.parse = jest.fn().mockReturnValue({ attributes: 'some-attributes' });
  });

  it('should return 400 if memberId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {
      pathParameters: { memberId },
    } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 on successful retrieval', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../getBrazeAttributes')).handler(event, context);
}
