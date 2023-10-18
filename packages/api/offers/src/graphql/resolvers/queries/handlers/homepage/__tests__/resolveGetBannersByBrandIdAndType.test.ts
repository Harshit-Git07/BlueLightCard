import { describe, expect, test } from '@jest/globals';
import { handler } from '../../queryLambdaResolver';
import { mockClient } from 'aws-sdk-client-mock';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { promises as fs } from 'fs';
import path from 'path';

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

describe('Test resolveGetBannersByBrandIdAndType', () => {
  const ORIGINAL_ENV = process.env;
  const JWT_ID_TOKEN: string =
  'eyJraWQiOiIxVXlpR3pQRmZkZTRQYWorK2tUSWhIQ2h5OFVaMkVQejRCNEd5SXZHcTdBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNGE0ZGUxNy1jYThhLTRmNWItOGE0ZC05NTYzMGEzYTM0NGMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTJfck5tUUVpRlM0IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZjRhNGRlMTctY2E4YS00ZjViLThhNGQtOTU2MzBhM2EzNDRjIiwib3JpZ2luX2p0aSI6ImY2ZDljNTI1LTFjYTQtNGQ4NC05ZTI2LTQzOTE1OTQ2NGJhZCIsImF1ZCI6IjQzbXBkMjAxYTVuZXRsbThwY2Jhb3Rpdm9mIiwiZXZlbnRfaWQiOiIzZjdkY2RkMi02MjIwLTRhODktODYzOC03ZTQ0Mjg4Njg5MDkiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5NzAyNTg0MSwiY3VzdG9tOmJsY19vbGRfaWQiOiIyODAwNTk4IiwiY3VzdG9tOmJsY19vbGRfdXVpZCI6IjZkY2ZhODZkLWNkM2QtNGRlNy04MzUwLTYyNTQ4OThkNjM3NCIsInBob25lX251bWJlciI6Iis0NDc3NjkzNTc5OTUiLCJleHAiOjE2OTcwMjk0NDAsImlhdCI6MTY5NzAyNTg0MSwianRpIjoiZmNkODFlMWYtODA0Ni00OGFhLThmOWYtY2RjY2ZhNDc1YTA2IiwiZW1haWwiOiJsdWtlam9obnNvbkBibHVlbGlnaHRjYXJkLmNvLnVrIn0.HC-rjcpzOrf7PtB3rTIHefYqljdfHoId1CCvG7IsSOM8rfn_Fp5DKIvAQGn5j5aEEtfmuNTUi-hA7NkaBEKBTpZc5PGL90I-epG_GsnSEo0fr0bALa0XSuZovgphwFjrm80q7P16ei6YxQ8PN-8Oc80maSjA-6IQ5XoHibxOuYdpnSgeBRxTdNQEm0WM5LA_apmYTbY3DcJx82-Ur47r205jT6VBvPrY4TElEXvaY7HCQzsCNydNiHn3M2EMM7L5Gbh0FkIwGmOdzQIQFZcO4pw82covls-4mcuYWDx7ElA1sxfNUC5XIqeGjeR24X8iupmIToZ8WCFESOOad5mqlg'

  beforeEach(() => {
    dynamoDbMock.reset();
    process.env = { ...ORIGINAL_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV; // Restore original environment
  });

  it('should fetch the data from DynamoDB', async () => {
    process.env.BANNER_TABLE = 'test-blc-mono-banners';
    const brandId = 'blc-uk';
    const type = 'sponsor';
    const tableName = process.env.BANNER_TABLE;

    const goBackDir = '../../../../../../';
    const banners = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'banners.json'), 'utf8')

    const currentTime = Math.floor( Date.now() / 1000 );
    const status = true;

    dynamoDbMock.on(QueryCommand, {
        TableName: tableName,
        KeyConditionExpression: '#type = :type AND expiresAt >= :currTime',
        FilterExpression: "brand = :brand AND startsAt <= :currTime AND #status = :status",
        IndexName: 'type',
        ExpressionAttributeValues: {
          ':brand': brandId,
          ':type': type,
          ':currTime': currentTime,
          ':status': status
        },
        ExpressionAttributeNames: {
          '#type': 'type',
          '#status': 'status'
        },
        Limit: 10
    }).resolves({
      Items: JSON.parse(banners)
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getBannersByBrandAndType',
      },
      arguments: {
        brandId,
        type
      },
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
      },
    };

    const result = await handler(event as any);

    expect(result).toBeDefined();
    expect(result).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          brand: 'blc-uk',
          status: true,
          type: 'sponsor'
        })
    ])
)
  })

  test('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getBannersByBrandAndType',
      },
      arguments: { type: 'sponsor' },
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
      },
    };

    await expect(handler(event as any)).rejects.toThrow('brandId is required');
  });

  test('should throw error if type is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getBannersByBrandAndType',
      },
      arguments: { brandId: 'blc-uk' },
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
      },
    };

    await expect(handler(event as any)).rejects.toThrow('type is required');
  });
});