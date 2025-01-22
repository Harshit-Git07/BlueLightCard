import { S3Event } from 'aws-lambda';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/applicationService');

const documentUploadCompleteMock = jest.fn();

describe('documentUploaded handler', () => {
  const memberId = 'valid-member-uuid';
  const documentId = 'valid-document-uuid';
  const applicationId = 'valid-application-uuid';
  const mockEvent: S3Event = {
    Records: [
      {
        eventVersion: '2.1',
        eventSource: 'aws:s3',
        awsRegion: 'us-east-1',
        eventTime: '2021-01-01T12:00:00.000Z',
        eventName: 'ObjectCreated:Put',
        userIdentity: {
          principalId: 'EXAMPLE',
        },
        requestParameters: {
          sourceIPAddress: '127.0.0.1',
        },
        responseElements: {
          'x-amz-request-id': 'EXAMPLE123456789',
          'x-amz-id-2': 'EXAMPLE123/456',
        },
        s3: {
          s3SchemaVersion: '1.0',
          configurationId: 'testConfigRule',
          bucket: {
            name: 'test-bucket',
            ownerIdentity: {
              principalId: 'EXAMPLE',
            },
            arn: 'arn:aws:s3:::test-bucket',
          },
          object: {
            key: `UPLOADS/${memberId}/${applicationId}/${documentId}`,
            size: 1024,
            eTag: '12345',
            sequencer: '12345',
          },
        },
      },
    ],
  };

  beforeEach(() => {
    ApplicationService.prototype.documentUploadComplete = documentUploadCompleteMock;
    jest.clearAllMocks();
  });

  it('should process the S3 event and update profile successfully', async () => {
    documentUploadCompleteMock.mockResolvedValue(undefined);

    await handler(mockEvent);

    expect(documentUploadCompleteMock).toHaveBeenCalledWith(memberId, applicationId, documentId);
  });
});

async function handler(event: S3Event): Promise<void> {
  return await (await import('../documentUploaded')).handler(event, emptyContextStub);
}
