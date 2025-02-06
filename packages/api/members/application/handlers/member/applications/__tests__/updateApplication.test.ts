import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  applicationService,
  ApplicationService,
} from '@blc-mono/members/application/services/applicationService';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { jest } from '@jest/globals';

jest.mock('@blc-mono/members/application/services/applicationService');
jest.mock('@blc-mono/members/application/services/emailService');

const memberId = uuidv4();
const applicationId = uuidv4();
const path = `/members/${memberId}/applications/${applicationId}`;
const httpMethod = 'PUT';

const application: UpdateApplicationModel = {
  city: 'New York',
};

const applicationServiceMock = jest.mocked(applicationService);
const updateApplicationMock = jest.fn<typeof ApplicationService.prototype.updateApplication>();

describe('updateApplication handler', () => {
  beforeEach(() => {
    applicationServiceMock.mockReturnValue({
      updateApplication: updateApplicationMock,
    } as unknown as ApplicationService);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { path, httpMethod } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body includes promo code', async () => {
    const response = await handler(
      eventWithApplication({
        promoCode: 'NHS12345',
      }),
    );

    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const event = {
      path,
      httpMethod,
      pathParameters: { memberId, applicationId },
      body: JSON.stringify(application),
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(204);
    expect(updateApplicationMock).toHaveBeenCalledWith(memberId, applicationId, application);
  });

  const eventWithApplication = (
    applicationModel?: UpdateApplicationModel,
  ): APIGatewayProxyEvent => {
    return {
      path,
      httpMethod,
      pathParameters: { memberId, applicationId },
      body: JSON.stringify(applicationModel ?? application),
    } as unknown as APIGatewayProxyEvent;
  };
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberApplicationHandler')).handler(event, emptyContextStub);
}
