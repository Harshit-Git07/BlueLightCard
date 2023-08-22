import { describe, expect, test } from '@jest/globals';
import { handler } from '../../queryLambdaResolver';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@aws-sdk/util-stream';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const s3Mock = mockClient(S3Client);

function toReadableStream(data: string | Buffer): Readable {
  const stream = new Readable();
  stream.push(data);
  stream.push(null);
  return sdkStreamMixin(stream);
}

describe('Test resolveGetOfferMenusByBrandId', () => {
  beforeEach(() => {
    s3Mock.reset();
  });

  it('should fetch data from s3', async () => {
    const market1Data = fs.readFileSync(path.join(__dirname, 'menusSampleData', '1.txt'));
    const market2Data = fs.readFileSync(path.join(__dirname, 'menusSampleData', '2.txt'));
    const dealsData = fs.readFileSync(path.join(__dirname, 'menusSampleData', 'deals.txt'));
    const featuresData = fs.readFileSync(path.join(__dirname, 'menusSampleData', 'features.txt'));
    const flexibleData = fs.readFileSync(path.join(__dirname, 'menusSampleData', 'flexible.txt'));

    s3Mock.on(ListObjectsV2Command, { Bucket: 'blc-uk', Prefix: 'sliders/' }).resolves({
      Contents: [{ Key: 'sliders/' }, { Key: 'sliders/1.txt' }, { Key: 'sliders/2.txt' }],
    });

    s3Mock.on(GetObjectCommand, { Bucket: 'blc-uk', Key: 'sliders/1.txt' }).resolves({
      Body: toReadableStream(market1Data) as any,
    });

    s3Mock.on(GetObjectCommand, { Bucket: 'blc-uk', Key: 'sliders/2.txt' }).resolves({
      Body: toReadableStream(market2Data) as any,
    });

    s3Mock.on(GetObjectCommand, { Bucket: 'blc-uk', Key: 'deals.txt' }).resolves({
      Body: toReadableStream(dealsData) as any,
    });

    s3Mock.on(GetObjectCommand, { Bucket: 'blc-uk', Key: 'features.txt' }).resolves({
      Body: toReadableStream(featuresData) as any,
    });

    s3Mock.on(GetObjectCommand, { Bucket: 'blc-uk', Key: 'flexible.txt' }).resolves({
      Body: toReadableStream(flexibleData) as any,
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
      },
      arguments: {
        brandId: 'blc-uk',
      },
    };

    const result = await handler(event as any);

    expect(result).toHaveProperty('marketPlace');
    expect(result).toHaveProperty('deals');
    expect(result).toHaveProperty('features');
    expect(result).toHaveProperty('flexible');
    expect(result.marketPlace).toHaveLength(2);
    expect(result.marketPlace[0].name).toBe('New offers');
    expect(result.marketPlace[0].items).not.toBeNull();
    expect(result.marketPlace[0].items.length).toBe(23);
    expect(result.marketPlace[1].name).toBe('Pet pal price drops');
    expect(result.marketPlace[1].items).not.toBeNull();
    expect(result.marketPlace[1].items.length).toBe(12);
    expect(result.deals).not.toBeNull();
    expect(result.deals.length).toBe(8);
    expect(result.features).not.toBeNull();
    expect(result.features.length).toBe(12);
    expect(result.flexible).not.toBeNull();
    expect(result.flexible.length).toBe(18);
    expect(result.flexible[0].items).not.toBeNull();
    expect(result.flexible[0].items.length).toBe(18);
  });

  test('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
      },
      arguments: {},
    };

    await expect(handler(event as any)).rejects.toThrow('brandId is required');
  });

  test('should throw error if bucket does not exist for brandId', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
      },
      arguments: {
        brandId: 'invalidBrandId',
      },
    };

    await expect(handler(event as any)).rejects.toThrow('No bucket found for brandId invalidBrandId');
  });

  // should throw error if no marketPlaceMenusFiles found for brandId
  test('should throw error if no marketPlaceMenusFiles found for brandId', async () => {
    s3Mock.on(ListObjectsV2Command, { Bucket: 'blc-uk', Prefix: 'sliders/' }).resolves({
      Contents: undefined,
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
      },
      arguments: {
        brandId: 'blc-uk',
      },
    };

    await expect(handler(event as any)).rejects.toThrow('No marketPlaceMenusFiles found for brandId blc-uk');
  });

  test('should throw error if marketPlaceMenus is undefined or lenght is 0', async () => {
    s3Mock.on(ListObjectsV2Command, { Bucket: 'blc-uk', Prefix: 'sliders/' }).resolves({
      Contents: [{ Key: 'sliders/' }],
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
      },
      arguments: {
        brandId: 'blc-uk',
      },
    };

    await expect(handler(event as any)).rejects.toThrow('No valid data found in MarketPlaceMenu files blc-uk');
  });
});
