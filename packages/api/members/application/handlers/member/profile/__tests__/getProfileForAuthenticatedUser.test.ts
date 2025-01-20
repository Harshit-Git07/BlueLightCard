import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/profileService');

describe('getProfile handler', () => {
  const memberId = uuidv4();
  const profile: ProfileModel = {
    memberId,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    email: 'john.doe@example.com',
    applications: [],
  };
  const event = { requestContext: { authorizer: { memberId } } } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ProfileService.prototype.getProfile = jest.fn().mockResolvedValue(profile);
  });

  it('should return 401 if memberId cannot be found from authentication context', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(401);
  });

  it('should return 200 with profile data on successful retrieval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(profile);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../getProfileForAuthenticatedUser')).handler(event, emptyContextStub);
}
