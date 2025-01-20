import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { UpdateApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('updateApplication handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const application: UpdateApplicationModel = {
    city: 'New York',
  };
  const event = {
    pathParameters: { memberId, applicationId },
    body: JSON.stringify(application),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ApplicationService.prototype.updateApplication = jest.fn();
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../updateApplication')).handler(event, emptyContextStub);
}
