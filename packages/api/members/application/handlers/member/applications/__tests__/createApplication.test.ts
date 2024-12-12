import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { CreateApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { ApplicationReason } from '@blc-mono/members/application/models/enums/ApplicationReason';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('createApplication handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const application: CreateApplicationModel = {
    applicationReason: ApplicationReason.SIGNUP,
    eligibilityStatus: EligibilityStatus.ELIGIBLE,
    startDate: '2024-01-01T00:00:00Z',
  };
  const event = {
    pathParameters: { memberId },
    body: JSON.stringify(application),
  } as any as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ApplicationService.prototype.createApplication = jest.fn().mockResolvedValue(applicationId);
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with application ID on successful creation', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({ applicationId });
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../createApplication')).handler(event, context);
}
