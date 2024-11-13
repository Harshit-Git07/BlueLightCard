import { S3Event } from 'aws-lambda';

var mockIdUploaded = jest.fn();
var mockCreateSystemNote = jest.fn();

jest.mock('../../services/memberProfileService', () => {
  return {
    MemberProfileService: jest.fn().mockImplementation(() => ({
      updateIdUploaded: mockIdUploaded,
      createSystemNote: mockCreateSystemNote,
    })),
  };
});

const { handler } = require('../profile/idUploaded');

describe('ID Uploaded Handler', () => {
  let mockEvent: S3Event;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process the S3 event and update profile successfully', async () => {
    mockEvent = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'test-bucket',
            },
            object: {
              key: 'UPLOADS/valid-member-uuid/12345-ID-document',
            },
          },
        },
      ],
    } as unknown as S3Event;

    mockIdUploaded.mockResolvedValue(undefined);
    mockCreateSystemNote.mockResolvedValue(undefined);

    await handler(mockEvent);

    expect(mockIdUploaded).toHaveBeenCalledWith(
      { memberUUID: 'valid-member-uuid' },
      { idUploaded: true },
      expect.any(Array),
    );
    expect(mockCreateSystemNote).toHaveBeenCalledWith('valid-member-uuid', {
      category: 'ID Uploaded',
      message: expect.stringContaining('ID document uploaded successfully on'),
    });
  });

  it('should log an error if updateIdUploaded throws an error', async () => {
    mockIdUploaded.mockRejectedValueOnce(new Error('Update error'));

    mockEvent = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'test-bucket',
            },
            object: {
              key: 'UPLOADS/valid-member-uuid/12345-ID-document',
            },
          },
        },
      ],
    } as unknown as S3Event;

    await expect(handler(mockEvent)).rejects.toThrow('Update error');
  });

  it('should log an error if createSystemNote throws an error', async () => {
    mockCreateSystemNote.mockRejectedValueOnce(new Error('System note error'));

    mockEvent = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'test-bucket',
            },
            object: {
              key: 'UPLOADS/valid-member-uuid/12345-ID-document',
            },
          },
        },
      ],
    } as unknown as S3Event;

    await expect(handler(mockEvent)).rejects.toThrow('System note error');
  });
});
