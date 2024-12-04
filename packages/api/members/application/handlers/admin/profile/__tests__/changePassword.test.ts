import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';

jest.mock('@blc-mono/members/application/services/profileService');

describe('changePassword handler', () => {
  const memberId = uuidv4();
  const context = {} as Context;

  beforeEach(() => {
    ProfileService.prototype.changePassword = jest.fn().mockResolvedValue(undefined);
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

  it('should return 400 if new password validation fails', async () => {
    const response = await handler(eventWithNewPassword('badNewPassword'), context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful password change', async () => {
    const response = await handler(eventWithNewPassword('m0reSecureP4ssword!'), context);
    expect(response.statusCode).toEqual(204);
  });

  const eventWithNewPassword = (newPassword: string): APIGatewayProxyEvent => {
    return {
      pathParameters: { memberId },
      body: JSON.stringify({
        email: 'email@example.com',
        currentPassword: 'oldPassword',
        newPassword: newPassword,
      }),
    } as unknown as APIGatewayProxyEvent;
  };
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../changePassword')).handler(event, context);
}
