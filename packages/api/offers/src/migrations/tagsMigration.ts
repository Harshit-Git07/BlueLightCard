import dotenv from 'dotenv';
import { Logger } from '@aws-lambda-powertools/logger';

import { TagService } from '../services/tagService';
import { Tag } from '../models/tag';

import selectTagsQuery from './sql/queries/selectTagsQuery';
import runSQLQuery from './sql/runSQLQuery';
import selectCountQuery from './sql/queries/selectCountQuery';

dotenv.config({
  path: '.env',
  debug: true,
});

const QUERY_LIMIT = 1000;
let SQL_TABLE_NAME = '';

const TAG_TABLE_NAME = process.env.TAG_TABLE_NAME;

if (!TAG_TABLE_NAME) {
  throw new Error('No target table name specified');
}

const logger = new Logger({ serviceName: 'tags-migration' });
const tagService = new TagService(TAG_TABLE_NAME, logger);

const migrateTags = async () => {
  const totalCountQuery = selectCountQuery(SQL_TABLE_NAME);
  const { count } = (await runSQLQuery(totalCountQuery, logger))[0] as { count: number };
  logger.info(`-- Total Count of Tags: ${count} --`);
  const iterationCount = Math.ceil(count / QUERY_LIMIT);
  logger.info(`-- Total number of fetch iteration required: ${iterationCount} --`);

  //Initialise
  let offset = 0;
  const batchWriteSize = 25;

  //Get tags from MySQL tbloffertags in batches
  for (let i = 1; i <= iterationCount; i++) {
    let newTagsCount = 0;
    let existingTagsCount = 0;
    let fetchTags: Tag[] = [];
    logger.info(`-- Fetch iteration ${i} of ${iterationCount} FROM ${SQL_TABLE_NAME} with OFFSET ${offset} started --`);
    const query = selectTagsQuery(SQL_TABLE_NAME, QUERY_LIMIT, offset);
    fetchTags = (await runSQLQuery(query, logger)) as Tag[];
    offset += QUERY_LIMIT;

    const batchIterations = Math.ceil(fetchTags.length / batchWriteSize);

    for (let i = 0; i < batchIterations; i++) {
      logger.info(`-- Write Iteration ${i + 1} of ${batchIterations} --`);
      const tagBatches = fetchTags.slice(i * batchWriteSize, (i + 1) * batchWriteSize);
      let { newTags, existingTags } = await tagService.batchCreateNoneExistingTagsByNames(
        tagBatches.map((tag) => tag.name.trim()),
      );
      newTagsCount += newTags.length;
      if (existingTags.length > 0) {
        existingTagsCount += existingTags.length;
      }
    }
    logger.info(`-- In fetch iteration ${i}, ${newTagsCount} new tags Inserted in DynamoDB --`);
    logger.info(`-- In fetch iteration ${i}, ${existingTagsCount} tags already exists --`);
    logger.info(`-- FETCHING ${QUERY_LIMIT} NEW TAGS FROM ${SQL_TABLE_NAME} finished --`);
  }
};

function readArgument() {
  const [, , sqlTableName] = process.argv;
  if (!sqlTableName) {
    throw new Error('No target table name specified');
  }

  try {
    SQL_TABLE_NAME = sqlTableName.split('=')[1];
  } catch (error) {
    throw new Error('No target table name specified. Please use correct format as: --sqlTableName=table_name');
  }
  console.log(`SQL_TABLE_NAME: ${SQL_TABLE_NAME}`);
}

const runMigration = async () => {
  readArgument();
  logger.info(`STARTING ${SQL_TABLE_NAME} MIGRATION`);
  const promiseQueries = [migrateTags()];
  await Promise.all(promiseQueries);
  logger.info(`FINISHED ${SQL_TABLE_NAME} MIGRATION`);
  process.exit();
};

runMigration();

