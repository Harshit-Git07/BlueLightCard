import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('approveApplication handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const requestContext = {
    authorizer: {
      memberId,
    },
  };
  const event = {
    requestContext: requestContext,
    pathParameters: { memberId, applicationId },
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ApplicationService.prototype.approveApplication = jest.fn();
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = {
      requestContext: requestContext,
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('should return 204 on successful approval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../approveApplication')).handler(event, emptyContextStub);
}
