import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { EmailChangeModel } from '@blc-mono/members/application/models/emailChangeModel';

jest.mock('@blc-mono/members/application/services/profileService');

describe('changeEmail handler', () => {
  const memberId = uuidv4();
  const emailChange: EmailChangeModel = {
    currentEmail: 'current@example.com',
    newEmail: 'new@example.com',
  };
  const event = {
    pathParameters: { memberId },
    body: JSON.stringify(emailChange),
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ProfileService.prototype.changeEmail = jest.fn().mockResolvedValue(undefined);
  });

  it('should return 400 if memberId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { pathParameters: { memberId } } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful email change', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../changeEmail')).handler(event, context);
}
