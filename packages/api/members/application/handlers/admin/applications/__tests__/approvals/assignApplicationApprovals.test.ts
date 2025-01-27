import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('assignApplicationApprovals handler', () => {
  const memberId = uuidv4();
  const applicationIds = [uuidv4(), uuidv4()];
  const allocation = { applicationIds };
  const event = {
    requestContext: {
      authorizer: {
        memberId,
      },
    },
    body: JSON.stringify(allocation),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ApplicationService.prototype.assignApplicationBatch = jest
      .fn()
      .mockResolvedValue(applicationIds);
  });

  it('should return 401 if adminId or adminName is missing', async () => {
    const event = { requestContext: { authorizer: {} } } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {
      requestContext: { authorizer: { memberId } },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('should return 200 with application IDs on successful assignment', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ applicationIds });
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (
    await import('../../approvals/assignApplicationApprovals')
  ).handler(event, emptyContextStub);
}
