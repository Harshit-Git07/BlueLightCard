import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('rejectApplication handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const applicationUpdate: UpdateApplicationModel = {
    rejectionReason: RejectionReason.BLURRY_IMAGE_DECLINE_ID,
  };
  const requestContext = {
    authorizer: {
      memberId,
    },
  };
  const event = {
    requestContext: requestContext,
    pathParameters: { memberId, applicationId },
    body: JSON.stringify(applicationUpdate),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ApplicationService.prototype.rejectApplication = jest.fn();
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = {
      requestContext: requestContext,
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('should return 204 on successful rejection', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../rejectApplication')).handler(event, emptyContextStub);
}
