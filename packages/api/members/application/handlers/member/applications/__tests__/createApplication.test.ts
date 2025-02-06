import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  applicationService,
  ApplicationService,
} from '@blc-mono/members/application/services/applicationService';
import { CreateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { jest } from '@jest/globals';

jest.mock('@blc-mono/members/application/services/applicationService');
jest.mock('@blc-mono/members/application/services/emailService');

const memberId = uuidv4();
const path = `/members/${memberId}/applications`;
const httpMethod = 'POST';

const applicationId = uuidv4();
const application: CreateApplicationModel = {
  applicationReason: ApplicationReason.SIGNUP,
  eligibilityStatus: EligibilityStatus.ELIGIBLE,
  startDate: '2024-01-01T00:00:00Z',
};

const applicationServiceMock = jest.mocked(applicationService);
const createApplicationMock = jest.fn<typeof ApplicationService.prototype.createApplication>();

describe('createApplication handler', () => {
  beforeEach(() => {
    applicationServiceMock.mockReturnValue({
      createApplication: createApplicationMock,
    } as unknown as ApplicationService);
    createApplicationMock.mockResolvedValue(applicationId);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { path, httpMethod } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with application ID on successful creation', async () => {
    const event = {
      path,
      httpMethod,
      pathParameters: { memberId },
      body: JSON.stringify(application),
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({ applicationId });
    expect(createApplicationMock).toHaveBeenCalledWith(memberId, application);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberApplicationHandler')).handler(event, emptyContextStub);
}
