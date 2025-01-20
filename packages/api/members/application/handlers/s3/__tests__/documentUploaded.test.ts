import { S3Event } from 'aws-lambda';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/profileService');

const documentUploadCompleteMock = jest.fn();

const event: S3Event = {
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
          key: 'UPLOADS/valid-member-uuid/12345-ID-document',
          size: 1024,
          eTag: '12345',
          sequencer: '12345',
        },
      },
    },
  ],
};

describe('documentUploaded handler', () => {
  beforeEach(() => {
    ProfileService.prototype.documentUploadComplete = documentUploadCompleteMock;
    jest.clearAllMocks();
  });

  it('should process the S3 event and update profile successfully', async () => {
    documentUploadCompleteMock.mockResolvedValue(undefined);

    await handler(event);

    expect(documentUploadCompleteMock).toHaveBeenCalledWith('valid-member-uuid');
  });
});

async function handler(event: S3Event): Promise<void> {
  return await (await import('../documentUploaded')).handler(event, emptyContextStub);
}
