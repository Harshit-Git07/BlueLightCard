import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  ProfileService,
  profileService,
} from '@blc-mono/members/application/services/profileService';
import { EmailChangeModel } from '@blc-mono/shared/models/members/emailChangeModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import {
  EmailService,
  emailService,
} from '@blc-mono/members/application/services/email/emailService';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';

jest.mock('@blc-mono/members/application/services/profileService');
jest.mock('@blc-mono/members/application/services/email/emailService');

const profileServiceMock = jest.mocked(profileService);
const emailServiceMock = jest.mocked(emailService);

const getProfileMock = jest.fn();
const sendEmailChangeRequestMock = jest.fn();

const memberId = uuidv4();
const emailChange: EmailChangeModel = {
  currentEmail: 'current@example.com',
  newEmail: 'new@example.com',
};
const profile = {
  email: 'current@example.com',
} as unknown as ProfileModel;
const event = {
  pathParameters: { memberId },
  body: JSON.stringify(emailChange),
} as unknown as APIGatewayProxyEvent;

describe('changeEmail handler', () => {
  beforeEach(() => {
    profileServiceMock.mockReturnValue({
      getProfile: getProfileMock,
    } as unknown as ProfileService);
    emailServiceMock.mockReturnValue({
      sendEmailChangeRequest: sendEmailChangeRequestMock,
    } as unknown as EmailService);

    getProfileMock.mockResolvedValue(profile);
  });

  it('should return 400 if memberId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(JSON.stringify({ error: 'Member ID is required' }));
  });

  it('should return 400 if request body is missing', async () => {
    const event = { pathParameters: { memberId } } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(JSON.stringify({ error: 'Missing request body' }));
  });

  it('should return 400 if old email does not match', async () => {
    const event = {
      pathParameters: { memberId },
      body: JSON.stringify({
        currentEmail: 'something@email.com',
        newEmail: emailChange.newEmail,
      }),
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(
      JSON.stringify({
        error:
          'Error sending change email: email in payload does not match current email does not match',
      }),
    );
  });

  it('should return 204 on successful email change', async () => {
    const response = await handler(event);

    expect(sendEmailChangeRequestMock).toHaveBeenCalledWith('new@example.com');
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../requestEmailChange')).handler(event, emptyContextStub);
}
