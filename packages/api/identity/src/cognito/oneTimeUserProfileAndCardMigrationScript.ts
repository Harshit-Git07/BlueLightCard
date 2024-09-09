import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { promises as fs } from 'fs';
import { v4 } from 'uuid';
import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';

import { getCardStatus } from './../../../core/src/utils/getCardStatus';
import { setDate } from './../../../core/src/utils/setDate';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';

interface RowData {
  id: number;
  email: string;
  emailValidated: number;
  spareemail: string;
  spareemailvalidated: number;
  name: string;
  surname: string;
  confirmed: number;
  service: string;
  county: number;
  GA_Key: string;
  uuid: string;
  dob: string;
  gender: string;
  mobile: string;
  merged_uid: number;
  merged_time: string;
  trustId: string;
  trustName: string;
  dateCreated: string;
  cardExpires: string;
  cardId: number;
  cardStatus: number;
  cardUid: string;
  cardPosted: string;
}
function checkBrand(brand: string, batchSize: number, offset: number, legacyTable: string): string {
  //takes the brand from the env, depending on the value, it will return a different query
  let mergedFields: string = '';
  switch (brand) {
    case 'DDS_UK':
      mergedFields = '';
      break;
    case 'BLC_UK':
    default:
      mergedFields = ' p.merged_uid, p.merged_time,';
  }
  return `SELECT u.id, u.spareemail, u.name, u.confirmed, u.surname, u.service, u.county, u.GA_Key, u.TrustMember,
    u.uuid, p.uid as profileuid, p.spareemailvalidated, p.dob, p.gender, p.mobile,${mergedFields} c.cardid as cardId, c.carduid as cardUid, c.cardstatus as cardStatus, c.expires as cardExpires, c.timePosted as cardPosted,
    t.trustId, t.trustName, t.trustPrimary
    FROM ${legacyTable} u 
    LEFT JOIN tbluserprofiles p 
    ON u.id = p.uid
    LEFT JOIN  (
        SELECT id as cardid, uid as carduid, cardstatus, expires, timePosted 
        FROM tblprivcards
        ORDER BY id DESC 
    ) c
    ON c.carduid = u.id 
    LEFT JOIN (
        SELECT tbltrusts.ID as trustId, tbltrusts.TrustName as trustName,tbltrustprimaries.TrustName as trustPrimary 
        FROM tbltrusts
        INNER JOIN tbltrustprimaries 
        ON tbltrusts.LinkID=tbltrustprimaries.LinkCode
    ) t 
    ON t.trustId = u.TrustMember
    ORDER BY u.id 
    LIMIT ${batchSize} OFFSET ${offset}`;
}
function validateData(rowData: RowData): { valid: boolean; reason?: string } {
  if (rowData.id === null || rowData.id === undefined)
    return { valid: false, reason: 'legacy user id is null or undefined' };
  if (rowData.uuid === null || rowData.uuid === undefined)
    return { valid: false, reason: 'user uuid is null or undefined' };
  if (rowData.name === null || rowData.name === undefined || rowData.name === 'GDPR')
    return { valid: false, reason: 'user name is null or undefined' };
  if (rowData.surname === null || rowData.surname === 'REMOVED' || rowData.surname === 'GDPR')
    return { valid: false, reason: 'user surname is null or undefined' };
  if (rowData.cardId === null || rowData.cardId === undefined)
    return { valid: false, reason: 'legacy card id is null or undefined' };
  if (rowData.cardStatus === null || rowData.cardStatus === undefined)
    return { valid: false, reason: 'card status is null or undefined' };
  return { valid: true };
}

dotenv.config({ path: './src/cognito/.env', debug: true });
const brand = getEnv(IdentityStackEnvironmentKeys.BRAND);
const host = getEnv(IdentityStackEnvironmentKeys.DB_HOST);
const legacyTable = getEnv(IdentityStackEnvironmentKeys.LEGACY_TABLE_NAME);
const port = parseInt(getEnvOrDefault(IdentityStackEnvironmentKeys.DB_PORT, '3306'));
const user = getEnv(IdentityStackEnvironmentKeys.DB_USER);
const password = getEnv(IdentityStackEnvironmentKeys.DB_PASSWORD);
const database = getEnv(IdentityStackEnvironmentKeys.DATABASE);
const region = getEnvOrDefault(IdentityStackEnvironmentKeys.REGION, 'eu-west-2');
const userPoolId = getEnv(IdentityStackEnvironmentKeys.USER_POOL_ID);
const tableName = getEnv(IdentityStackEnvironmentKeys.DYNAMO_TABLE);
const idMappingTableName = getEnv(IdentityStackEnvironmentKeys.DYNAMO_ID_MAPPING_TABLE);

export async function migrate(): Promise<{ status: string; message: string }> {
  if (
    host === '' ||
    brand === '' ||
    password === '' ||
    user === '' ||
    userPoolId === '' ||
    tableName === ''
  ) {
    return { status: 'error ', message: 'env variables missing' };
  }

  const failedCardMigrationsFile = `Failed-${Date.now().toString()}.txt`;
  const offsetRecordFile = `Offset-${Date.now().toString()}.txt`;
  const successfullCardMigrationsFile = `Successfull-${Date.now().toString()}.txt`;

  let failed = 0;
  let successfull = 0;
  let batchNumber = 0;
  const batchSize: number = parseInt(
    getEnvOrDefault(IdentityStackEnvironmentKeys.BATCH_SIZE, '1000'),
  );

  let offset: number = parseInt(getEnvOrDefault(IdentityStackEnvironmentKeys.OFFSET, '0'));
  // create the connection to database
  const connection = await mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
  });
  const dynamoclient = new DynamoDBClient({ region: region });
  const dynamodb = DynamoDBDocumentClient.from(dynamoclient);

  while (true) {
    const query = checkBrand(brand || '', batchSize, offset, legacyTable || '');
    const queryTimeStart = new Date().getTime();
    const [result] = await connection.query(query);

    let rows: RowData[] = [];
    console.log(`Time taken to run query ${new Date().getTime() - queryTimeStart}ms`);

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
          failedCardMigrationsFile,
          `${row.uuid} - ${row.cardId} - ${reason ?? 'Unknown'}\n`,
          { flag: 'a' },
        );
        failed++;
        continue;
      }
      const userParams = {
        Item: {
          pk: `MEMBER#${row.uuid}`,
          sk: `BRAND#${brand}`,
          legacy_id: row.id,
        },
        TableName: tableName,
      };
      const idMappingParams = {
        Item: {
          legacy_id: `BRAND#${brand}#${row.id}`,
          uuid: row.uuid,
        },
        TableName: idMappingTableName,
      };
      try {
        promises.push(dynamodb.send(new PutCommand(userParams)));
        promises.push(dynamodb.send(new PutCommand(idMappingParams)));
        await fs.writeFile(successfullCardMigrationsFile, `${row.uuid}\n`, { flag: 'a' });
      } catch (err: any) {
        await fs.writeFile(
          failedCardMigrationsFile,
          `Failed to add user data item to dynamo ${row.uuid} - ${
            reason ?? (err as Error).message
          }}\n`,
          { flag: 'a' },
        );
        failed++;
      }

      const queryParams = {
        TableName: tableName,
        KeyConditionExpression: '#pk= :pk And begins_with(#sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `MEMBER#${row.uuid}`,
          ':sk': `PROFILE#`,
        },
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
      };
      let oldProfileUuid = null;
      const result = await dynamodb.send(new QueryCommand(queryParams));
      if (result.Items !== null && result.Count !== 0) {
        const user = result.Items?.at(0) as Record<string, string>;
        oldProfileUuid = user.sk;
      }
      const profileUuid: string = v4();
      let dob = null;
      if (!isNaN(Date.parse(row.dob))) {
        dob =
          row.dob !== null || row.dob !== '0000-00-00'
            ? new Date(row.dob).toISOString().substring(0, 10)
            : null;
      }
      //profile
      const profileParams = {
        Item: {
          pk: `MEMBER#${row.uuid}`,
          sk: oldProfileUuid !== null ? oldProfileUuid : `PROFILE#${profileUuid}`,
          firstname: row.name,
          surname: row.surname,
          email: row.email ?? ' ',
          email_validated: row.emailValidated ?? '0',
          spare_email: row.spareemail ?? ' ',
          spare_email_validated: row.spareemailvalidated ?? '0',
          organisation: row.service ?? ' ',
          gender: row.gender ?? 'O',
          dob: dob,
          merged_uid: row.merged_uid ? row.merged_uid.toString() : '0',
          merged_time: `${setDate(row.merged_time)}`,
          mobile: row.mobile ?? ' ',
          employer: row.trustName ?? ' ',
          employer_id: row.trustId ? row.trustId.toString() : '0',
          ga_key: row.GA_Key ?? ' ',
        },
        TableName: tableName,
      };
      try {
        promises.push(dynamodb.send(new PutCommand(profileParams)));
        await fs.writeFile(successfullCardMigrationsFile, `${row.uuid}\n`, { flag: 'a' });
      } catch (err: any) {
        await fs.writeFile(
          failedCardMigrationsFile,
          `Failed to add user profile data item to dynamo ${row.uuid} - ${
            reason ?? (err as Error).message
          }\n`,
          { flag: 'a' },
        );
        failed++;
      }
      //card
      const cardParams = {
        Item: {
          pk: `MEMBER#${row.uuid}`,
          sk: `CARD#${row.cardId}`,
          status: getCardStatus(Number(row.cardStatus)),
          expires: `${setDate(row.cardExpires)}`,
          posted: `${setDate(row.cardPosted)}`,
        },
        TableName: tableName,
      };

      try {
        promises.push(dynamodb.send(new PutCommand(cardParams)));
        successfull++; //after all 3 inserts
        await fs.writeFile(successfullCardMigrationsFile, `${row.uuid}\n${row.cardId}\n`, {
          flag: 'a',
        });
      } catch (err: any) {
        await fs.writeFile(
          failedCardMigrationsFile,
          `Failed to add user card data item to dynamo  ${row.uuid} - ${
            reason ?? (err as Error).message
          }\n`,
          { flag: 'a' },
        );
        failed++;
      }
    }
    // execute Promise.all on promises with a catch on error
    if (promises.length > 0) {
      await Promise.all(promises).catch((error) => {
        console.error(`Failed to add item to dynamo ${error as string}`);
      });
    }
    batchNumber++;
    offset += batchSize;
    await fs.writeFile(offsetRecordFile, offset.toString());
    console.log(
      `Processed batch ${batchNumber} - successfull: ${successfull} - current offset: ${offset}`,
    );
  }
  await connection.end();
  return { status: 'success', message: `total successfull ${successfull}, total failed ${failed}` };
}

migrate()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    process.exit(0);
  });
