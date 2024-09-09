import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  UpdateCommandInput,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { promises as fs } from 'fs';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';

dotenv.config({ path: __dirname + '/.env' });

const region: string = getEnvOrDefault(IdentityStackEnvironmentKeys.REGION, 'eu-west-2');
const tableName: string = getEnv(IdentityStackEnvironmentKeys.DYNAMO_TABLE);

const host: string = getEnv(IdentityStackEnvironmentKeys.DB_HOST);
const legacyTable: string = getEnv(IdentityStackEnvironmentKeys.LEGACY_TABLE_NAME);

const port: number = parseInt(getEnvOrDefault(IdentityStackEnvironmentKeys.DB_PORT, '3306'));

const user: string = getEnv(IdentityStackEnvironmentKeys.DB_USER);
const password: string = getEnv(IdentityStackEnvironmentKeys.DB_PASSWORD);
const database: string = getEnv(IdentityStackEnvironmentKeys.DATABASE);

const failedItemsFileName = `itemsFailed-${Date.now().toString()}.txt`;
const itemsNotFoundFileName = `itemsNotFound-${Date.now().toString()}.txt`;
const duplicateItemsFileName = `itemsDuplicate-${Date.now().toString()}.txt`;
const offsetRecordFile = `finalOffset.txt`;

const dynamoclient = new DynamoDBClient({ region: region });
const dynamodb = DynamoDBDocumentClient.from(dynamoclient);
let processedItems = 0;
let failed = 0;

async function addEmailData() {
  if (host === '' || password === '' || user === '' || tableName === '' || legacyTable === '') {
    return { status: 'error ', message: 'env variables missing' };
  }

  const connection = await mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
  });

  let batchNumber = 0;

  const batchSize: number = parseInt(
    getEnvOrDefault(IdentityStackEnvironmentKeys.BATCH_SIZE, '2000'),
  );

  let offset: number = parseInt(getEnvOrDefault(IdentityStackEnvironmentKeys.OFFSET, '0'));

  while (true) {
    const query = fetchDBRecords(batchSize, offset);
    const [result] = await connection.query(query);

    let rows: RowData[] = [];

    if (Array.isArray(result) && result.length > 0) {
      rows = result as RowData[];
    }

    const promises = [];

    if (rows.length === 0) {
      break;
    }
    for (const row of rows) {
      const { valid, reason } = validateData(row);

      if (!valid) {
        await fs.writeFile(
          failedItemsFileName,
          `Failed to update item with id: ${row.id} - uuid: ${row.uuid}\n`,
          { flag: 'a' },
        );
        failed++;
        continue;
      } else {
        promises.push(await addDataToDynamo(row));
      }
    }

    // execute Promise.all on promises with a catch on error
    if (promises.length > 0) {
      await Promise.all(promises)
        .then(() => {
          console.log(
            `Processed total ${++batchNumber} batches - Processed Items: ${processedItems} - failed Items: ${failed} - current offset: ${offset}`,
          );
        })
        .catch((error) => {
          console.error(`Failed to add item to dynamo ${error as string}`);
        });
    }

    offset += batchSize;
    await fs.writeFile(offsetRecordFile, offset.toString());
  }
  await connection.end();
  return {
    status: 'success',
    message: `total processed items ${processedItems}, total failed ${failed}`,
  };
}

async function addDataToDynamo(item: RowData) {
  if (item.uuid !== null && item.uuid !== undefined && item.uuid !== '' && item.uuid !== 'uuid') {
    const sk = await findSecondaryKey(item.uuid);

    if (sk !== undefined) {
      const updateParams: UpdateCommandInput = {
        TableName: tableName,
        Key: {
          pk: `MEMBER#${item.uuid}`,
          sk: `${sk}`,
        },
        UpdateExpression:
          'set email = :email, email_validated = :email_validated, confirmed = :confirmed',
        ExpressionAttributeValues: {
          ':email': item.email,
          ':email_validated': item.validated,
          ':confirmed': item.confirmed,
        },
        ReturnValues: 'UPDATED_NEW',
      };

      try {
        const result = await dynamodb.send(new UpdateCommand(updateParams));
        processedItems++;
      } catch (err: any) {
        await fs.writeFile(failedItemsFileName, `Failed to update ${item.uuid}\n`, { flag: 'a' });
      }
    }
  }
}

async function findSecondaryKey(uuid: string) {
  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: '#pk= :pk And begins_with(#sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `MEMBER#${uuid}`,
      ':sk': `PROFILE#`,
    },
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
  };

  const result = await dynamodb.send(new QueryCommand(queryParams));
  if (result.Items === null || result.Items?.length === 0) {
    await fs.writeFile(itemsNotFoundFileName, `${uuid}\n`, { flag: 'a' });
    failed++;
    return undefined;
  } else if (result.Items !== undefined && result.Items?.length > 1) {
    await fs.writeFile(duplicateItemsFileName, `${uuid}\n`, { flag: 'a' });
    failed++;
    return undefined;
  } else {
    return (result.Items?.at(0) as Record<string, string>).sk;
  }
}

function validateData(rowData: RowData): { valid: any; reason?: any } {
  if (rowData.id === null || rowData.id === undefined)
    return { valid: false, reason: 'legacy user id is null or undefined' };
  else if (rowData.uuid === null || rowData.uuid === undefined)
    return { valid: false, reason: 'user uuid is null or undefined' };
  else if (rowData.email === null || rowData.email === undefined || rowData.email === '')
    return { valid: false, reason: 'Email is null or undefined' };
  else if (rowData.validated === null || rowData.validated === undefined)
    return { valid: false, reason: 'validated is null or undefined' };
  else if (rowData.confirmed === null || rowData.confirmed === undefined)
    return { valid: false, reason: 'confirmed is null or undefined' };

  return { valid: true };
}

function fetchDBRecords(batchSize: number, offset: number) {
  return `SELECT u.id, u.uuid, u.email, u.validated, u.confirmed
  FROM ${legacyTable} u 
  ORDER BY u.id 
  LIMIT ${batchSize} OFFSET ${offset}`;
}

interface RowData {
  id: number;
  uuid: string;
  email: string;
  validated: number;
  confirmed: number;
}

addEmailData();
