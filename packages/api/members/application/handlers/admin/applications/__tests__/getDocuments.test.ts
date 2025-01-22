import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { DocumentListPresignedUrl } from '@blc-mono/shared/models/members/documentUpload';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('getDocuments handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const documents: DocumentListPresignedUrl = { documents: ['signedUrl1', 'signedUrl2'] };
  const event = {
    pathParameters: { memberId, applicationId },
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ApplicationService.prototype.getDocumentsFromApplication = jest
      .fn()
      .mockResolvedValue(documents);
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event, context);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with documents on success', async () => {
    const response = await handler(event, context);

    expect(response.statusCode).toEqual(200);

    expect(JSON.parse(response.body)).toEqual(documents);
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return await (await import('../getDocuments')).handler(event, context);
}
