import { handler} from "../s3MenusBucketEventQueueListenerLambdaHandler";
import { mockClient} from "aws-sdk-client-mock";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { sdkStreamMixin } from '@aws-sdk/util-stream';
import { Readable } from 'stream';
import { beforeEach, describe, expect, jest } from "@jest/globals";
import { promises as fs } from "fs";
import path from "path";
import { BLC_UK, OFFER_MENUS_FILE_NAMES } from "../../utils/global-constants";
import { Convertor } from "../../utils/convertor";

process.env.OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';

const s3Mock = mockClient(S3Client)
const dynamoDbMock = mockClient(DynamoDBDocumentClient);

const tableName = process.env.OFFER_HOMEPAGE_TABLE;
const goBackDir = '../../';
const bucketName = 'test-blc-uk-offer-menus';
describe('Test s3MenusBucketEventQueueListenerLambdaHandler', () => {

  beforeEach(() => {
    s3Mock.reset();
    dynamoDbMock.reset();
    jest.resetAllMocks();
  });

  it('should process an SQS S3 event for FEATURED type and save data to DynamoDB', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.FEATURED, bucketName);
    const featured = await getFileData(OFFER_MENUS_FILE_NAMES.FEATURED);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.FEATURED }).resolves({
      Body: toReadableStream(featured) as any
    })

    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.FEATURED, featured.toString()));

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);

  });

  it('should process an SQS S3 event for FLEXIBLE type and save data to DynamoDB', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.FLEXIBLE, bucketName);
    const flexible = await getFileData(OFFER_MENUS_FILE_NAMES.FLEXIBLE);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.FLEXIBLE }).resolves({
      Body: toReadableStream(flexible) as any
    })

    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.FLEXIBLE, flexible.toString()));

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);

  });

  it('should process an SQS S3 event for DEALS type and save data to DynamoDB', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.DEALS, bucketName);
    const deals = await getFileData(OFFER_MENUS_FILE_NAMES.DEALS);

    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.DEALS }).resolves({
      Body: toReadableStream(deals) as any
    })

    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.DEALS, deals.toString()));

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);

  });

  it('should process an SQS S3 event for POPULAR type and save data to DynamoDB', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.POPULAR, bucketName);
    const popular = await getFileData(OFFER_MENUS_FILE_NAMES.POPULAR);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.POPULAR }).resolves({
      Body: toReadableStream(popular) as any
    })

    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.POPULAR, popular.toString()));

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);

  });

  it('should process an SQS S3 event for CATEGORIES type and save data to DynamoDB', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.CATEGORIES, bucketName);
    const categories = await getFileData(OFFER_MENUS_FILE_NAMES.CATEGORIES);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.CATEGORIES }).resolves({
      Body: toReadableStream(categories) as any
    })

    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.CATEGORIES, categories.toString()));

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);

  });

  it('should process an SQS S3 event for COMPANIES type and save data to DynamoDB', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.COMPANIES, bucketName);
    const companies = await getFileData(OFFER_MENUS_FILE_NAMES.COMPANIES);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.COMPANIES }).resolves({
      Body: toReadableStream(companies) as any
    })

    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.COMPANIES, companies.toString()));

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(1);
    expect(s3Mock.calls()).toHaveLength(1);

  });

  it('should process an SQS S3 event for MARKETPLACE type and save data to DynamoDB for first Item', async () => {
    const key = `${OFFER_MENUS_FILE_NAMES.MARKETPLACE}/1.txt`;
    const event = createEvent(key, bucketName);
    const slider = await getFileData(key);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: key }).resolves({
      Body: toReadableStream(slider) as any
    })

    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.MARKETPLACE, slider.toString()));
    dynamoDbMock.on(GetCommand).resolves({});

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(2);
    expect(s3Mock.calls()).toHaveLength(1);
  });

  it('should process an SQS S3 event for MARKETPLACE type and save data to DynamoDB for existing Item', async () => {
    const key = `${OFFER_MENUS_FILE_NAMES.MARKETPLACE}/1.txt`;
    const event = createEvent(key, bucketName);
    const slider = await getFileData(key);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: key }).resolves({
      Body: toReadableStream(slider) as any
    })
    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.MARKETPLACE, slider.toString()));
    dynamoDbMock.on(GetCommand).resolves({
      Item: {
        id: BLC_UK,
        type: OFFER_MENUS_FILE_NAMES.MARKETPLACE,
        json: {
          '2.txt': 'file content',
          '3.txt': 'file content',
        }
      }
    });

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(2);
    expect(s3Mock.calls()).toHaveLength(1);
  });

  it('should process an SQS S3 event for MARKETPLACE type and save data to DynamoDB for add to existing field', async () => {
    const key = `${OFFER_MENUS_FILE_NAMES.MARKETPLACE}/1.txt`;
    const event = createEvent(key, bucketName);
    const slider = await getFileData(key);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: key }).resolves({
      Body: toReadableStream(slider) as any
    })
    dynamoDbMock.on(PutCommand).resolves(mockPutDynamoResult(BLC_UK, OFFER_MENUS_FILE_NAMES.MARKETPLACE, slider.toString()));
    dynamoDbMock.on(GetCommand).resolves({
      Item: {
        id: BLC_UK,
        type: OFFER_MENUS_FILE_NAMES.MARKETPLACE,
        json: {
          '1.txt': 'file content',
          '2.txt': 'file content',
        }
      }
    });

    await handler(event);

    expect(dynamoDbMock.calls()).toHaveLength(2);
    expect(s3Mock.calls()).toHaveLength(1);
  });

  it('should throw error if id is not found in bucket name', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.FEATURED, 'invalid-bucket-name');
    await expect(handler(event)).rejects.toThrowError('error getting valid bucket name');
  });

  it('should throw error if key is not found in valid types', async () => {
    const event = createEvent('INVALID_KEY', bucketName);
    await expect(handler(event)).rejects.toThrowError('error getting valid key');
  });

  it('it should return nothing if no records found in S3 event', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({}),
        }
      ]
    }
    await expect(handler(event)).resolves.toBeUndefined();
  });

  it('should throw error if fetching to s3 failed', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.FEATURED, bucketName);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.FEATURED }).rejects(new Error('error fetching data from S3'));

    await expect(handler(event)).rejects.toThrowError('error fetching data from S3');
  });

  it('should throw error if returned data from s3 has empty body ', async () => {
    const event = createEvent(OFFER_MENUS_FILE_NAMES.FEATURED, bucketName);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.FEATURED }).resolves({
      Body: undefined
    });

    await expect(handler(event)).rejects.toThrowError('error reading returned data from S3');
  });

  it("should throw error if failed to convert stream to string", () => {
    const mock = jest.spyOn(Convertor, 'streamToString').mockImplementation(() => {
      throw new Error('error converting stream to string');
    });
    const event = createEvent(OFFER_MENUS_FILE_NAMES.FEATURED, bucketName);
    s3Mock.on(GetObjectCommand, { Bucket: bucketName, Key: OFFER_MENUS_FILE_NAMES.FEATURED }).resolves({
      Body: toReadableStream(Buffer.from('test')) as any
    });

    expect(handler(event)).rejects.toThrowError('error converting stream to string');
  });

  function mockPutDynamoResult(brandId: string, type: string, data: string) {
    return {
      Attributes: {
        id: brandId,
        type: OFFER_MENUS_FILE_NAMES.DEALS,
        json: data
      }
    }
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
                    name: bucketName
                  },
                  object: {
                    key: key
                  }
                }
              }
            ]
          }),
        }
      ]
    }
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

