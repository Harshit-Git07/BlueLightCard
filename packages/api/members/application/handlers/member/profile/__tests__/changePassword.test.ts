import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { PasswordChangeModel } from '@blc-mono/members/application/models/passwordChangeModel';

jest.mock('@blc-mono/members/application/services/profileService');

describe('changePassword handler', () => {
  const memberId = uuidv4();
  const passwordChange: PasswordChangeModel = {
    email: 'email@example.com',
    currentPassword: 'oldPass',
    newPassword: 'newPass',
  };
  const event = {
    pathParameters: { memberId },
    body: JSON.stringify(passwordChange),
  } as unknown as APIGatewayProxyEvent;
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

  it('should return 204 on successful password change', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../changePassword')).handler(event, context);
}
