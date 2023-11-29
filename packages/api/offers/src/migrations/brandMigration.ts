import { Logger } from '@aws-lambda-powertools/logger';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
import { Brand } from "../models/brand";
import { BrandService } from "../services/brandService";

dotenv.config({
  path: '.env',
  debug: true,
});

const DATA_FILE_PATH = 'data/brands.json';
const logger = new Logger({ serviceName: 'brand-migration' });
const brandTableName = process.env.BRAND_TABLE_NAME;

if (!brandTableName) {
  throw new Error('No target table name specified');
}

const brandService = new BrandService(brandTableName, logger);

function readDataFile(fileName: string) {
  let fileContents;
  try {
    logger.info(`Reading file ${fileName}`);
    fileContents = fs.readFileSync(path.join(__dirname, fileName), 'utf8');
  } catch (err) {
    logger.error('Error reading file from disk:', { error: err });
    throw err;
  }
  logger.info(`File ${fileName} read successfully`);
  return JSON.parse(fileContents);
}

const runMigration = async () => {
  logger.info('-- Brand Migration Started --');
  const items: Brand[] = readDataFile(DATA_FILE_PATH);

  try {
    await brandService.batchWrite(items);
  }catch (err) {
    logger.error('Error writing to table:', { error: err });
    throw err;
  }

  logger.info('-- Brand Migration Finished --');

  process.exit();
};

runMigration();
