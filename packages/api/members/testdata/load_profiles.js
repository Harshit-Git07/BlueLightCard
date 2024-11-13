import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
import fs from 'fs';

const options = {
  region: 'eu-west-2',
  retryStrategy: new ConfiguredRetryStrategy(5, (attempt) => 200 + attempt * 1000),
};

const client = new DynamoDBClient(options);

let tableName = process.env['MEMBER_TABLE_DYNAMO'];
if (tableName === undefined)
  throw new Error('Please set MEMBER_TABLE_DYNAMO environmental variable for target tabel');

async function batchWriteItems(items) {
  const requestItems = items.map((item) => ({
    PutRequest: {
      Item: {
        pk: {
          S: item.pk,
        },
        sk: {
          S: item.sk,
        },
        FirstName: {
          S: item.FirstName,
        },
        LastName: {
          S: item.LastName,
        },
        DateOfBirth: {
          S: item.DateOfBirth,
        },
        Gender: {
          S: item.Gender,
        },
        PhoneNumber: {
          S: item.PhoneNumber,
        },
        County: {
          S: item.County,
        },
        Email: {
          S: item.Email,
        },
        EmailValidated: {
          BOOL: item.EmailValidated,
        },
        SpareEmail: {
          NULL: true,
        },
        SpareEmailValidated: {
          BOOL: false,
        },
        EmploymentType: {
          S: item.EmploymentType,
        },
        OrganisationId: {
          S: item.OrganisationId,
        },
        EmployerId: {
          S: item.EmployerId,
        },
        EmployerName: {
          NULL: true,
        },
        JobTitle: {
          S: item.JobTitle,
        },
        JobReference: {
          NULL: true,
        },
        SignupDate: {
          S: item.SignupDate,
        },
        GAKey: {
          NULL: true,
        },
        Status: {
          S: item.Status,
        },
        LastLogin: {
          NULL: true,
        },
        LastIpAddress: {
          NULL: true,
        },
        Updated: {
          S: item.Updated,
        },
        UpdatedBy: {
          S: item.UpdatedBy,
        },
      },
    },
  }));

  const command = new BatchWriteItemCommand({
    RequestItems: {
      [tableName]: requestItems,
    },
    ReturnConsumedCapacity: 'TOTAL',
  });

  const response = await client.send(command);
  return response;
}

async function addProfiles() {
  const lines = fs.readFileSync('memberprofiles_profiles_upload.json', 'utf-8').split(/\r?\n/);
  const items = lines.map((line) => JSON.parse(line));

  while (items.length) {
    const batch = items.splice(0, 25);
    try {
      await batchWriteItems(batch);
    } catch (error) {
      console.log('Batch Write Error:', error);
    }
  }
}

addProfiles();
