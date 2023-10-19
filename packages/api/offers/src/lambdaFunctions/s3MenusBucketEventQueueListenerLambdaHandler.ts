import { Logger } from "@aws-lambda-powertools/logger";
import { BLC_UK, BLC_AUS, DDS_UK, TYPE_KEYS, OFFER_MENUS_FILE_NAMES } from "../utils/global-constants";
import { Convertor } from "../utils/convertor";
import { S3Helper } from "../../../core/src/aws/s3/s3Helper";
import { OfferHomepageRepository } from "../repositories/offersHomepageRepository";

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

export const handler = async (event: any) => {
  logger.info("event", { event });

  for (const record of event.Records) {
    const s3Event = JSON.parse(record.body);
    if (!s3Event.Records) {
      logger.warn("no records found in S3 event", { s3Event });
      return;
    }
    const s3Record = s3Event.Records[0];
    const bucket = s3Record.s3.bucket.name;
    const key = s3Record.s3.object.key;

    let id;
    if (bucket.includes(BLC_UK)) {
      id = BLC_UK;
    } else if (bucket.includes(BLC_AUS)) {
      id = BLC_AUS;
    } else if (bucket.includes(DDS_UK)) {
      id = DDS_UK;
    } else {
      logger.warn("error getting valid bucket name", { bucket });
      return;
    }

    let type = dataType.find((data) => key.includes(data.key));

    if (!type) {
      logger.warn("error getting valid key", { key });
      return;
    }

    const fileData = await getFileData(bucket, key);

    const item = {
      id,
      type: type?.value,
      json: fileData
    };
    await offerHomePageRepository.save(item);
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