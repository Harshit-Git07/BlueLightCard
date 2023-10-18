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

interface Item {
  id: string,
  type: string | undefined
  json?: { [key: string]: string } | any
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
      logger.warn("no records found in S3 event");
      return;
    }
    const s3Record = s3Event.Records[0];
    const bucket = s3Record.s3.bucket.name;
    const key = s3Record.s3.object.key;

    if (key === OFFER_MENUS_FILE_NAMES.MARKETPLACE) {
      logger.warn("slider folder encountered. doing nothing.");
      return;
    }
    
    let id;
    if (bucket.includes(BLC_UK)) {
      id = BLC_UK;
    } else if (bucket.includes(BLC_AUS)) {
      id = BLC_AUS;
    } else if (bucket.includes(DDS_UK)) {
      id = DDS_UK;
    } else {
      logger.error("error getting valid bucket name");
      throw new Error("error getting valid bucket name");
    }

    let type = dataType.find((data) => key.includes(data.key));

    if (!type) {
      logger.error("error getting valid key");
      throw new Error("error getting valid key");
    }

    const fileData = await getFileData(bucket, key);

    let item: Item = {
      id,
      type: type?.value,
      json: {}
    };

    if (type?.value === TYPE_KEYS.MARKETPLACE) {
      const jsonKey = key.replace("sliders/", "");
      const currentData = await offerHomePageRepository.getByIdAndType({ id, type: type.value });

      if (currentData && currentData.Item) {
        const currentItem = currentData.Item;
        currentItem.json = JSON.parse(currentItem.json);
        currentItem.json[jsonKey] = JSON.parse(fileData);
        currentItem.json = JSON.stringify(currentItem.json);
        await offerHomePageRepository.save(currentItem);
      } else {
        item.json[jsonKey] = JSON.parse(fileData);
        item.json = JSON.stringify(item.json);
        await offerHomePageRepository.save(item);
      }
    } else {
      item.json = fileData;
      await offerHomePageRepository.save(item);
    }
  }
};

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