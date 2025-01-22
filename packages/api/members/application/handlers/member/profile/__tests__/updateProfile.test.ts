import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { UpdateProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/profileService');

describe('updateProfile handler', () => {
  const memberId = uuidv4();
  const profile: UpdateProfileModel = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
  };
  const event = {
    pathParameters: { memberId },
    body: JSON.stringify(profile),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ProfileService.prototype.updateProfile = jest.fn().mockResolvedValue(undefined);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../updateProfile')).handler(event, emptyContextStub);
}
