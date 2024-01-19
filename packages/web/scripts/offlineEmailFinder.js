const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  ListUsersCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const fsp = require('fs').promises;
const fs = require('fs');
const csv = require('@fast-csv/parse');
const { max } = require('lodash');
const maxRows =
  process.argv.length === 6 && process.argv[4] === ('-m' || '--maxRow')
    ? parseInt(process.argv[5])
    : 10;

let mobileNumberList = [];
require('dotenv').config();
//get csv from command line argument -f or --file
const csvFilePath =
  process.argv.length >= 4 && process.argv[2] === ('-f' || '--file') ? process.argv[3] : null;

const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

const cognitoClient = new CognitoIdentityProviderClient(config);
const dynamoClient = new DynamoDBClient(config);

async function getUserFromCognito(phoneNumber) {
  const input = {
    UserPoolId: 'eu-west-2_jrwTfFRgM', //proccess.env.COGNITO_USER_POOL_ID,
    AttributesToGet: ['email'],
    Filter: `phone_number = \"${phoneNumber}\"`,
    Limit: 1,
  };

  const command = new ListUsersCommand(input);
  const response = await cognitoClient.send(command);
  return response;
}

async function spareEmailExistsInCognito(mobileNumber) {
  try {
    const response = await getUserFromCognito(mobileNumber);
    emailAttribute = response.Users[0].Attributes[0].Value;
    return emailAttribute;
  } catch (e) {
    return undefined;
  }
}
const queryCognito = (row) =>
  new Promise(async (resolve, reject) => {
    const params = {
      TableName: 'production-blc-mono-identityTable',
      KeyConditionExpression: 'pk = :uuid',
      ExpressionAttributeValues: {
        ':uuid': 'MEMBER#' + row.uuid,
      },
    };
    const response = await dynamoClient.send(new QueryCommand(params));
    const mobile = response.Items[response.Items.length - 1]?.mobile;
    if (
      response.Items[response.Items.length - 1]?.mobile?.length === 11 &&
      parseInt(mobile) !== 0
    ) {
      //remove leading zero and add +44
      const mobileWithCode = '+44' + mobile.slice(1);
      mobileNumberList.push(mobileWithCode);
    }
    resolve();
  });

async function replaceLastEvaluatedKeyInFile(lastEvaluatedKey) {
  const filePath = 'packages/web/scripts/lastEvaluatedKey.json';
  await fsp.writeFile(filePath, JSON.stringify(lastEvaluatedKey), 'utf8');
}

async function getOfflineEmailsFromDynamoDB() {
  if (!fs.existsSync('packages/web/scripts/lastEvaluatedKey.json')) {
    await fsp.writeFile('packages/web/scripts/lastEvaluatedKey.json', '', 'utf8');
  }
  const lastEvaluatedKeyFile = await fsp.readFile(
    'packages/web/scripts/lastEvaluatedKey.json',
    'utf8'
  );
  let spareEmailsExistInCognitoPromises;
  const lastEvaluatedKey = lastEvaluatedKeyFile ? parseInt(JSON.parse(lastEvaluatedKeyFile)) : 0;

  var mobileNumberPromises = [];
  const csv_file = await fs
    .createReadStream(csvFilePath, 'utf8')
    .pipe(csv.parse({ headers: true, maxRows: maxRows, skipRows: lastEvaluatedKey }))
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      mobileNumberPromises.push(queryCognito(row));
    })
    .on('end', async () => {
      await Promise.all(mobileNumberPromises);

      spareEmailsExistInCognitoPromises = mobileNumberList.reduce((accumulator, currentValue) => {
        const mobile = currentValue;
        if (mobile) {
          accumulator.push(spareEmailExistsInCognito(mobile));
        }
        return accumulator;
      }, []);
      const emailsInCognito = (await Promise.all(spareEmailsExistInCognitoPromises)).filter(
        (email) => email
      );
      let appendString = '';
      emailsInCognito.forEach((email) => {
        appendString += `\n${email}`;
      });
      await fsp.appendFile('packages/web/scripts/spare_emails_offline.csv', appendString);
    });

  // set last evaluated key to the last row scanned
  await replaceLastEvaluatedKeyInFile(lastEvaluatedKey + maxRows);
}

//if there are no command line arguments or if they are valid, if so run the script
if (csvFilePath) {
  getOfflineEmailsFromDynamoDB();
} else {
  console.log(
    '\nUsage: node offlineEmailFinder.js -f <file path> OPTIONAL: -m <max number of rows>\n'
  );
}
