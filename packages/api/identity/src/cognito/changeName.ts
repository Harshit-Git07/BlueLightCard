import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand, ScanCommand} from '@aws-sdk/lib-dynamodb';
import AWS from 'aws-sdk';
import {promises as fs} from 'fs';

const dynamoclient = new DynamoDBClient({region: 'eu-west-2'});
const dynamodb = DynamoDBDocumentClient.from(dynamoclient);

// Specify your table name
const tableName = 'production-blc-mono-identityTable';

// Create a function to handle paginated scan with FilterExpression and UpdateExpression
const scanItems = async (ExclusiveStartKey?: AWS.DynamoDB.DocumentClient.Key) => {
  const params = {
    TableName: tableName,
    ExclusiveStartKey,
    FilterExpression: 'begins_with(sk, :prefix)',
    ExpressionAttributeValues: { ':prefix': 'PROFILE#ff5083e4-4848-4a0e-9030-dc0f289762fa' }
  };

  try {
    const data = await dynamodb.send(new ScanCommand(params));
    return data;
  } catch (error) {
    console.error("Error scanning table:", error);
    throw error;
  }
};

// Paginate through items with sk starting with "PROFILE#"
const updateItems = async () => {
  let exclusiveStartKey = undefined;
  let failed = 0;
  let successfull = 0;
  const failedCardMigrationsFile = `Failed-${Date.now().toString()}.txt`;
  const successfullCardMigrationsFile = `Successfull-${Date.now().toString()}.txt`;
  do {
    console.log('Scanning...');
    const data = await scanItems(exclusiveStartKey);
    console.log('Scan succeeded.');
    if (data.Items) {
      console.log(data.Items.length);
      const promises = [];
      for (const item of data.Items) {
        try {
          const profileParams = {
            Item: {
              pk: item.pk,
              sk: item.sk,
              firstname: item.name,
              surname: item.surname,
              spare_email: item.spare_email,
              spare_email_validated: item.spare_email_validated,
              organisation: item.organisation,
              gender: item.gender,
              dob: item.dob,
              merged_uid: item.merged_uid,
              merged_time: item.merged_time,
              mobile: item.mobile,
              employer: item.employer,
              employer_id: item.employer_id,
              ga_key: item.ga_key
            },
            TableName: tableName
          };
          promises.push(dynamodb.send(new PutCommand(profileParams)));
          await fs.writeFile(successfullCardMigrationsFile, `${item.pk}\n`, {flag: 'a'});
        } catch (err: any) {
          console.log(`error ${item.pk} : ${err.message}`);
          await fs.writeFile(failedCardMigrationsFile, `Failed to add user profile data item to dynamo ${item.pk} - ${(err as Error).message}\n`, {flag: 'a'});
          failed++;
        }

      }
      if (promises.length > 0) {
        await Promise.all(promises).catch((error) => {
          console.error(`Failed to add item to dynamo ${error as string}`);
        });
      }
      exclusiveStartKey = data.LastEvaluatedKey;
    }
  } while (exclusiveStartKey);
  console.log("Update completed.");
};

updateItems();
