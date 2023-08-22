import { AppSyncResolverEvent } from 'aws-lambda';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: `queryLambdaResolver` });
const blcUKBucket = process.env.BUCKET_BLC_UK as string;
const blcAUSBucket = process.env.BUCKET_BLC_AUS as string;
const ddsUKBucket = process.env.BUCKET_DDS_UK as string;
const s3Client = new S3Client({});
const brandIdToBucketMap = new Map<string, string>([
  ['blc-uk', blcUKBucket],
  ['blc-aus', blcAUSBucket],
  ['dds-uk', ddsUKBucket],
]);

export async function resolveGetOfferMenusByBrandId(event: AppSyncResolverEvent<any>) {
  const brandId = event.arguments?.brandId;

  if (!brandId) {
    logger.error('brandId is required', { brandId });
    throw new Error('brandId is required');
  }
  const bucketName = brandIdToBucketMap.get(brandId.toLowerCase());

  if (!bucketName) {
    logger.error('No bucket found for brandId', { brandId });
    throw new Error(`No bucket found for brandId ${brandId}`);
  }

  const marketPlaceMenusFiles = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'sliders/',
    }),
  );

  if (marketPlaceMenusFiles.Contents === undefined) {
    logger.error('No marketPlaceMenusFiles found for brandId', { brandId });
    throw new Error(`No marketPlaceMenusFiles found for brandId ${brandId}`);
  }

  const marketPlaceMenusPromises = marketPlaceMenusFiles.Contents?.filter((file) => file.Key !== 'sliders/').map(
    async (file) => {
      return await fetchDataFromS3(bucketName, file.Key as string);
    },
  );

  const marketPlaceMenus = await Promise.all(marketPlaceMenusPromises as Promise<any>[]);

  if (marketPlaceMenus === undefined || marketPlaceMenus.length === 0) {
    logger.error('No valid data found in MarketPlaceMenu files', { brandId });
    throw new Error(`No valid data found in MarketPlaceMenu files ${brandId}`);
  }

  marketPlaceMenus.forEach((market) => {
    logger.info('menu', { market });
    if (market.items) {
      market.items = Object.entries(market.items).map(([id, item]) => ({ id, item }));
    }
  });

  const flexibleMenu = await fetchDataFromS3(bucketName, 'flexible.txt');
  const dealOfTheWeek = await fetchDataFromS3(bucketName, 'deals.txt');
  const featuresMenus = await fetchDataFromS3(bucketName, 'features.txt');

  return {
    features: featuresMenus,
    flexible: flexibleMenu,
    deals: dealOfTheWeek,
    marketPlace: marketPlaceMenus,
  };
}

function streamToString(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', (err: any) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

async function fetchDataFromS3(bucket: string, key: string) {
  try {
    const respone = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    if (respone.Body === undefined) {
      logger.error('No data found in s3: ', { bucket, key });
      throw new Error(`No data found in s3 ${bucket} ${key}`);
    }
    return JSON.parse((await streamToString(respone.Body)) as string);
  } catch (error) {
    logger.error('Unexpected Error during fetchDataFromS3: ', { error });
    throw error;
  }
}
