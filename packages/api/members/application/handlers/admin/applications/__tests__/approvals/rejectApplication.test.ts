import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('rejectApplication handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const event = {
    pathParameters: { memberId, applicationId },
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ApplicationService.prototype.rejectApplication = jest.fn();
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful rejection', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../../approvals/rejectApplication')).handler(event, context);
}
