import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

describe('uploadDocument handler', () => {
  const memberId = uuidv4();
  const applicationId = uuidv4();
  const documentUploadLocation = { preSignedUrl: 'https://example.com/upload' };
  const event = {
    pathParameters: { memberId, applicationId },
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ApplicationService.prototype.generateDocumentUploadUrl = jest
      .fn()
      .mockResolvedValue(documentUploadLocation);
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('should return 200 with document upload location on success', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(documentUploadLocation);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../uploadDocument')).handler(event, emptyContextStub);
}
