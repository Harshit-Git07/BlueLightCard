import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { AdminCreateProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { Auth0ClientService } from '@blc-mono/members/application/services/auth0/auth0ClientService';

jest.mock('@blc-mono/members/application/services/profileService');
jest.mock('@blc-mono/members/application/services/auth0/auth0ClientService');

const serviceLayerCreateProfileMock = jest.fn();
const serviceLayerDeleteProfileMock = jest.fn();
const auth0CreateUserMock = jest.fn();

describe('createProfile handler', () => {
  const memberId = uuidv4();
  const profile: AdminCreateProfileModel = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    email: 'john.doe@example.com',
    password: 'password',
  };
  const event = { body: JSON.stringify(profile) } as APIGatewayProxyEvent;

  beforeEach(() => {
    ProfileService.prototype.createProfile = serviceLayerCreateProfileMock;
    ProfileService.prototype.deleteProfile = serviceLayerDeleteProfileMock;
    serviceLayerCreateProfileMock.mockResolvedValue(memberId);

    Auth0ClientService.prototype.createUser = auth0CreateUserMock;
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with memberId on successful creation', async () => {
    const response = await handler(event);

    expect(serviceLayerCreateProfileMock).toHaveBeenCalledWith(profile);
    expect(auth0CreateUserMock).toHaveBeenCalledWith(memberId, profile);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({ memberId });
  });

  it('should return 500 status, and delete the profile if auth0 fails to create', async () => {
    auth0CreateUserMock.mockRejectedValue(new Error('Failed for test'));

    const response = await handler(event);

    expect(serviceLayerCreateProfileMock).toHaveBeenCalledWith(profile);
    expect(auth0CreateUserMock).toHaveBeenCalledWith(memberId, profile);
    expect(serviceLayerDeleteProfileMock).toHaveBeenCalledWith(memberId);
    expect(response.statusCode).toEqual(500);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../createProfile')).handler(event, emptyContextStub);
}
