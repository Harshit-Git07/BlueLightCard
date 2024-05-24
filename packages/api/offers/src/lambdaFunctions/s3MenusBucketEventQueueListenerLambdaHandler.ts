import 'reflect-metadata';
import { Logger } from "@aws-lambda-powertools/logger";
import { TYPE_KEYS, OFFER_MENUS_FILE_NAMES } from "../utils/global-constants";
import { Convertor } from "../utils/convertor";
import { S3Helper } from "../../../core/src/aws/s3/s3Helper";
import { OfferHomepageRepository } from "../repositories/offersHomepageRepository";
import { S3Event } from 'aws-lambda'

const logger = new Logger({ serviceName: `S3MenusBucketEventQueueListenerLambdaHandler` });
const offerHomepageTableName = process.env.OFFER_HOMEPAGE_TABLE as string;
const offerHomePageRepository = new OfferHomepageRepository(offerHomepageTableName);

interface DataType {
  key: string;
  value: string;
}

const dataType: DataType[] = [
  { key: OFFER_MENUS_FILE_NAMES.CATEGORIES, value: TYPE_KEYS.CATEGORIES },
  { key: OFFER_MENUS_FILE_NAMES.COMPANIES, value: TYPE_KEYS.COMPANIES },
  { key: OFFER_MENUS_FILE_NAMES.DEALS, value: TYPE_KEYS.DEALS },
  { key: OFFER_MENUS_FILE_NAMES.FEATURED, value: TYPE_KEYS.FEATURED },
  { key: OFFER_MENUS_FILE_NAMES.FLEXIBLE, value: TYPE_KEYS.FLEXIBLE },
  { key: OFFER_MENUS_FILE_NAMES.POPULAR, value: TYPE_KEYS.POPULAR },
  { key: OFFER_MENUS_FILE_NAMES.MARKETPLACE, value: TYPE_KEYS.MARKETPLACE }
];

const shouldEventBeProcessed = (s3EventSource: string): boolean => {
  if (process.env.USE_REGIONAL_MENUS_BUCKET === 'true') {
    return s3EventSource === process.env.REGIONAL_MENUS_BUCKET;
  } else {
    return s3EventSource === process.env.LEGACY_MENUS_BUCKET;
  }
};

export const handler = async (event: any) => {
  logger.info("event", { event });

  for (const record of event.Records) {
    const s3Event = JSON.parse(record.body) as S3Event;
    if (!s3Event.Records) {
      logger.warn("no records found in S3 event", { s3Event });
      return;
    }
    const s3Record = s3Event.Records[0];
    const s3EventSource = s3Record.s3.bucket.name;
    const key = s3Record.s3.object.key;

    if (shouldEventBeProcessed(s3EventSource)) {
      let type = dataType.find((data) => key.includes(data.key));

      if (!type) {
        logger.warn("error getting valid key", { key });
        return;
      }

      let fileData = await getFileData(s3EventSource, key);

      if (type.key === OFFER_MENUS_FILE_NAMES.MARKETPLACE) {
        const regex = new RegExp('"id"', 'g');
        fileData = fileData.replace(regex, '"offerId"');
      }

      const item = {
        id: process.env.OFFERS_HOMEPAGE_MENU_BRAND_PREFIX,
        type: type?.value,
        json: fileData
      };
      await offerHomePageRepository.save(item);
    }
  }
};

/**
 * Retrieves data from an S3 bucket with the specified bucket and key.
 *
 * @param {string} bucket - The name of the S3 bucket.
 * @param {string} key - The key of the file in the S3 bucket.
 * @return {Promise<string>} The data fetched from the S3 bucket and converted to a string.
 */
async function getFileData(bucket: string, key: string) {
  let s3FileData;
  try {
    s3FileData = await S3Helper.fetch(bucket, key);
  } catch (error) {
    logger.error("error fetching data from S3", { error });
    throw error;
  }

  if (!s3FileData.Body) {
    logger.error("error reading returned data from S3");
    throw new Error("error reading returned data from S3");
  }

  try {
    return Convertor.streamToString(s3FileData.Body);
  } catch (error) {
    logger.error("error converting stream to string", { error });
    throw error;
  }
}
