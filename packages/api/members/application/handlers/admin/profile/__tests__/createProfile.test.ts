import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { CreateProfileModel } from '@blc-mono/members/application/models/profileModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/profileService');

describe('createProfile handler', () => {
  const memberId = uuidv4();
  const profile: CreateProfileModel = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    email: 'john.doe@example.com',
  };
  const event = { body: JSON.stringify(profile) } as APIGatewayProxyEvent;

  beforeEach(() => {
    ProfileService.prototype.createProfile = jest.fn().mockResolvedValue(memberId);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with memberId on successful creation', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({ memberId });
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../createProfile')).handler(event, emptyContextStub);
}
