import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { UpdateApplicationModel } from '@blc-mono/members/application/models/applicationModel';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('updateApplication handler', () => {
  const application: UpdateApplicationModel = {
    memberId: uuidv4(),
    applicationId: uuidv4(),
    city: 'New York',
  };
  const event = {
    body: JSON.stringify(application),
  } as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ApplicationService.prototype.updateApplication = jest.fn();
  });

  it('should return 400 if request body is missing', async () => {
    const event = {} as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(204);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../updateApplication')).handler(event, context);
}
