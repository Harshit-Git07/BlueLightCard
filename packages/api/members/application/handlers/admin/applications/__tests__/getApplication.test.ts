import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { ApplicationReason } from '@blc-mono/members/application/models/enums/ApplicationReason';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('getApplication handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const application: ApplicationModel = {
    memberId,
    applicationId,
    applicationReason: ApplicationReason.SIGNUP,
  };
  const event = {
    pathParameters: { memberId, applicationId },
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ApplicationService.prototype.getApplication = jest.fn().mockResolvedValue(application);
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with application on success', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(application);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../getApplication')).handler(event, context);
}
