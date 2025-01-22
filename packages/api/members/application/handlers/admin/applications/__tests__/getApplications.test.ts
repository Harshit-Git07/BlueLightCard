import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('getApplications handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const applications: ApplicationModel[] = [
    {
      memberId,
      applicationId,
      applicationReason: ApplicationReason.SIGNUP,
    },
  ];
  const event = {
    pathParameters: { memberId },
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ApplicationService.prototype.getApplications = jest.fn().mockResolvedValue(applications);
  });

  it('should return 400 if memberId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('should return 200 with applications on success', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(applications);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../getApplications')).handler(event, emptyContextStub);
}
