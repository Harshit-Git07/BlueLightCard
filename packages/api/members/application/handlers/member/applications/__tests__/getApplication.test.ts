import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  applicationService,
  ApplicationService,
} from '@blc-mono/members/application/services/applicationService';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { jest } from '@jest/globals';

jest.mock('@blc-mono/members/application/services/applicationService');
jest.mock('@blc-mono/members/application/services/emailService');

const memberId = uuidv4();
const applicationId = uuidv4();
const path = `/members/${memberId}/applications/${applicationId}`;
const httpMethod = 'GET';

const application: ApplicationModel = {
  memberId,
  applicationId,
  applicationReason: ApplicationReason.SIGNUP,
};

const applicationServiceMock = jest.mocked(applicationService);
const getApplicationMock = jest.fn<typeof ApplicationService.prototype.getApplication>();

describe('getApplication handler', () => {
  beforeEach(() => {
    applicationServiceMock.mockReturnValue({
      getApplication: getApplicationMock,
    } as unknown as ApplicationService);
    getApplicationMock.mockResolvedValue(application);
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = { path, httpMethod, pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with application on success', async () => {
    const event = {
      path,
      httpMethod,
      pathParameters: { memberId, applicationId },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(application);
    expect(getApplicationMock).toHaveBeenCalledWith(memberId, applicationId);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberApplicationHandler')).handler(event, emptyContextStub);
}
