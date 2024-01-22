// Usage: node spareEmailFinderAlt.js -f <filePath> OPTIONAL: -m 10
// Description: This script will read the csv file and find the spare emails that exist in cognito - Alternate script that uses a loop instead of reduce; should be more consistent, but slower
// and append them to the spare_emails.csv file. It will also update the lastEvaluatedKey.json file
// with the last evaluated key so that the next time the script is run, it will start from the last
// evaluated key. The maxRows argument is optional and will default to 10 if not provided.
const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const fsp = require('fs').promises;
const fs = require('fs');
const csv = require('@fast-csv/parse');
const { max, get } = require('lodash');
const maxRows =
  process.argv.length === 6 && process.argv[4] === ('-m' || '--maxRow')
    ? parseInt(process.argv[5])
    : 10;
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

async function getUserFromCognito(username) {
  const input = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  };
  const command = new AdminGetUserCommand(input);
  const response = await cognitoClient.send(command);
  // console.log(response)
  return response;
}

async function spareEmailExistsInCognito(spareEmail) {
  try {
    const response = await getUserFromCognito(spareEmail);
    const emailAttribute = response.UserAttributes.find(
      ({ Name, Value }) => Name === 'email' && Value === spareEmail
    );
    return emailAttribute.Value;
  } catch (e) {
    return undefined;
  }
}

async function replaceLastEvaluatedKeyInFile(lastEvaluatedKey) {
  const filePath = 'packages/web/scripts/lastEvaluatedKey.json';
  await fsp.writeFile(filePath, JSON.stringify(lastEvaluatedKey), 'utf8');
}

async function getSpareEmailsFromCSV() {
  //if lastEvaluatedKey.json does not exist, create a blank file
  if (!fs.existsSync('packages/web/scripts/lastEvaluatedKey.json')) {
    await fsp.writeFile('packages/web/scripts/lastEvaluatedKey.json', '', 'utf8');
  }
  const lastEvaluatedKeyFile = await fsp.readFile(
    'packages/web/scripts/lastEvaluatedKey.json',
    'utf8'
  );
  let spareEmailsExistInCognitoPromises;
  const lastEvaluatedKey = lastEvaluatedKeyFile ? parseInt(JSON.parse(lastEvaluatedKeyFile)) : 0;

  // read first 10 lines of csv file excluding header and store each value in an array
  var email_list = [];
  let appendString = '';
  let emailsInCognito = [];
  let timer;
  const csv_file = await fs
    .createReadStream(csvFilePath, 'utf8')
    .pipe(csv.parse({ headers: true, maxRows: maxRows, skipRows: lastEvaluatedKey }))
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      email_list.push(row);
    })
    .on('end', async () => {
      console.log(`email_list length: ${email_list.length}`);
      for (let i = 0; i < email_list.length; i++) {
        const spareEmail = await spareEmailExistsInCognito(email_list[i].spareemail);
        if (spareEmail) {
          emailsInCognito.push(spareEmail);
          timer = setTimeout(() => {
            console.log(`i: ${i}, email: ${spareEmail}`);
            clearTimeout(timer);
          }, 100);
        }
      }

      emailsInCognito.forEach((email) => {
        appendString += `\n${email}`;
      });

      await fsp.appendFile('packages/web/scripts/spare_emails.csv', appendString);
    });

  // set last evaluated key to the last row scanned
  await replaceLastEvaluatedKeyInFile(lastEvaluatedKey + maxRows);
}
if (csvFilePath) {
  getSpareEmailsFromCSV();
} else {
  console.log(process.argv.length);
  console.log(
    '\nUsage: node spareEmailFinderAlt.js -f <file path> OPTIONAL: -m <max number of rows>\n'
  );
}
