import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('releaseApplicationApprovals handler', () => {
  const adminId = uuidv4();
  const applicationIds = [uuidv4(), uuidv4()];
  const allocation = { applicationIds };
  const event = {
    requestContext: { authorizer: { adminId } },
    body: JSON.stringify(allocation),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ApplicationService.prototype.releaseApplicationBatch = jest.fn();
  });

  it('should return 401 if adminId is missing', async () => {
    const event = { requestContext: { authorizer: {} } } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {
      requestContext: { authorizer: { adminId } },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('should return 204 on successful release', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (
    await import('../../approvals/releaseApplicationApprovals')
  ).handler(event, emptyContextStub);
}
