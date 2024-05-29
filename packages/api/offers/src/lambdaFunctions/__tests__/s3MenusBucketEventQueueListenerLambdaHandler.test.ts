import 'reflect-metadata';
import { handler } from '../s3MenusBucketEventQueueListenerLambdaHandler';
import { mockClient } from 'aws-sdk-client-mock';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { sdkStreamMixin } from '@smithy/util-stream';
import { Readable } from 'stream';
import { promises as fs } from 'fs';
import path from 'path';
import { BLC_UK, OFFER_MENUS_FILE_NAMES } from '../../utils/global-constants';

const s3Mock = mockClient(S3Client);
const dynamoDbMock = mockClient(DynamoDBDocumentClient);

const regionalBucketName = 'regional-bucket';

const originalEnv = process.env;

describe('Test s3MenusBucketEventQueueListenerLambdaHandler', () => {
  afterEach(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    s3Mock.reset();
    dynamoDbMock.reset();
    jest.resetAllMocks();
    jest.resetModules();

    process.env = {
      ...originalEnv,
      OFFER_HOMEPAGE_TABLE: 'test-blc-mono-offersHomepage',
      OFFERS_HOMEPAGE_MENU_BRAND_PREFIX: 'blc-uk',
      REGIONAL_MENUS_BUCKET: regionalBucketName,
    };
  });

  it('should NOT process SQS S3 event if bucket name from event is NOT the regional bucket name', async () => {
    const event = await givenS3EventReceivedFromSQS('invalid_bucket', OFFER_MENUS_FILE_NAMES.FEATURED);

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(0);
  });

  it('should process SQS S3 event if bucket name from event is the regional bucket name', async () => {
    const event = await givenS3EventReceivedFromSQS(regionalBucketName, OFFER_MENUS_FILE_NAMES.FEATURED);

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);
  });

  it.each([
    OFFER_MENUS_FILE_NAMES.FEATURED,
    OFFER_MENUS_FILE_NAMES.FLEXIBLE,
    OFFER_MENUS_FILE_NAMES.DEALS,
    OFFER_MENUS_FILE_NAMES.POPULAR,
    OFFER_MENUS_FILE_NAMES.CATEGORIES,
    OFFER_MENUS_FILE_NAMES.COMPANIES,
    OFFER_MENUS_FILE_NAMES.MARKETPLACE,
  ])('should process an SQS S3 event for %s type and save data to DynamoDB', async (fileName) => {
    const event = await givenS3EventReceivedFromSQS(regionalBucketName, fileName);

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);
  });

  const givenS3EventReceivedFromSQS = async (sourceBucket: string, fileName: string) => {
    const event = createEvent(fileName, sourceBucket);
    const fileData = await getFileData(fileName);
    s3Mock.on(GetObjectCommand, { Bucket: sourceBucket, Key: fileName }).resolves({
      Body: toReadableStream(fileData) as any,
    });
    dynamoDbMock
      .on(PutCommand)
      .resolves(mockPutDynamoResult(BLC_UK, sourceBucket, fileData.toString()));
    return event;
  }

  function mockPutDynamoResult(brandId: string, type: string, data: string) {
    return {
      Attributes: {
        id: brandId,
        type: OFFER_MENUS_FILE_NAMES.DEALS,
        json: data,
      },
    };
  }

  function createEvent(key: string, bucketName: string) {
    return {
      Records: [
        {
          body: JSON.stringify({
            Records: [
              {
                s3: {
                  bucket: {
                    name: bucketName,
                  },
                  object: {
                    key: key,
                  },
                },
              },
            ],
          }),
        },
      ],
    };
  }

  function toReadableStream(data: string | Buffer): Readable {
    const stream = new Readable();
    stream.push(data);
    stream.push(null);
    return sdkStreamMixin(stream);
  }

  async function getFileData(fileName: string) {
    return await fs.readFile(path.join(__dirname, '../../', 'seeds', 'sample-files', fileName));
  }
});
