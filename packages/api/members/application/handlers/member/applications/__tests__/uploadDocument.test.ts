import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  applicationService,
  ApplicationService,
} from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { DocumentUploadLocation } from '@blc-mono/shared/models/members/documentUpload';
import { jest } from '@jest/globals';

jest.mock('@blc-mono/members/application/services/applicationService');
jest.mock('@blc-mono/members/application/services/email/emailService');

const memberId = uuidv4();
const applicationId = uuidv4();
const path = `/members/${memberId}/applications/${applicationId}/uploadDocument`;
const httpMethod = 'POST';

const documentUploadLocation: DocumentUploadLocation = {
  preSignedUrl: 'https://example.com/upload',
  documentId: 'documentId stub',
};

const applicationServiceMock = jest.mocked(applicationService);
const generateDocumentUploadUrlMock =
  jest.fn<typeof ApplicationService.prototype.generateDocumentUploadUrl>();

describe('uploadDocument handler', () => {
  beforeEach(() => {
    applicationServiceMock.mockReturnValue({
      generateDocumentUploadUrl: generateDocumentUploadUrlMock,
    } as unknown as ApplicationService);
    generateDocumentUploadUrlMock.mockResolvedValue(documentUploadLocation);
  });

  it('should return 400 if memberId or applicationId is missing', async () => {
    const event = { path, httpMethod, pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with document upload location on success', async () => {
    const event = {
      path,
      httpMethod,
      pathParameters: { memberId, applicationId },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(documentUploadLocation);
    expect(generateDocumentUploadUrlMock).toHaveBeenCalledWith(memberId, applicationId);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberApplicationHandler')).handler(event, emptyContextStub);
}
