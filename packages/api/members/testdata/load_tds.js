import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
import fs from 'fs';

const options = {
  region: 'eu-west-2',
  retryStrategy: new ConfiguredRetryStrategy(5, (attempt) => 200 + attempt * 1000),
};

const client = new DynamoDBClient(options);

let tableName = process.env['MEMBER_CODES_DYNAMO'];
if (tableName === undefined)
  throw new Error('Please set MEMBER_CODES_DYNAMO environmental variable for target tabel');

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function putItem(item) {
  const input = {
    Item: {
      pk: {
        S: item.pk,
      },
      sk: {
        S: item.sk,
      },
      TrustedDomain: {
        S: item.TrustedDomain,
      },
      Active: {
        BOOL: item.Active,
      },
      Updated: {
        S: item.Updated,
      },
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: tableName,
  };

  const command = new PutItemCommand(input);
  const response = await client.send(command);

  return response;
}

async function addTrustedDomains() {
  const lines = fs.readFileSync('membercodes_tds_upload.json', 'utf-8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    putItem(JSON.parse(lines[i])).then(
      function (response) {
        // console.log(response);
      },
      function (error) {
        console.log(error);
      },
    );
    await sleep(250);
  }
}

addTrustedDomains();
