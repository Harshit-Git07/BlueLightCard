import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('assignApplicationApprovals handler', () => {
  const adminId = uuidv4();
  const adminName = 'Admin Name';
  const applicationIds = [uuidv4(), uuidv4()];
  const allocation = { applicationIds };
  const event = {
    requestContext: { authorizer: { adminId, adminName } },
    body: JSON.stringify(allocation),
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ApplicationService.prototype.assignApplicationBatch = jest
      .fn()
      .mockResolvedValue(applicationIds);
  });

  it('should return 401 if adminId or adminName is missing', async () => {
    const event = { requestContext: { authorizer: {} } } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(401);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {
      requestContext: { authorizer: { adminId, adminName } },
    } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with application IDs on successful assignment', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({ applicationIds });
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../../approvals/assignApplicationApprovals')).handler(event, context);
}
