// Author: Gabriel Walton
// Usage: node deleteEmails.js -f <file path> OPTIONAL: -m <max number of rows>
// Description: write a csv file of accounts in cognito that are made from the spare email attribute in dynamodb, fo future deletion
// Example: node spareEmailFinder.js -f packages/web/scripts/<filename>.csv -m 1000
// Dependencies: aws-sdk, @fast-csv/parse, lodash, date-fns, dotenv
// Environment variables: AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY, COGNITO_USER_POOL_ID

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

  var email_list = [];
  let appendString = '';
  const csv_file = await fs
    .createReadStream(csvFilePath, 'utf8')
    .pipe(csv.parse({ headers: true, maxRows: maxRows, skipRows: lastEvaluatedKey }))
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      email_list.push(row);
    })
    .on('end', async () => {
      spareEmailsExistInCognitoPromises = email_list.reduce((accumulator, currentValue) => {
        const spareEmail = currentValue.spareemail;
        if (spareEmail) {
          accumulator.push(spareEmailExistsInCognito(spareEmail));
        }
        return accumulator;
      }, []);
      const emailsInCognito = (await Promise.all(spareEmailsExistInCognitoPromises)).filter(
        (email) => email
      );

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
    '\nUsage: node spareEmailFinder.js -f <file path> OPTIONAL: -m <max number of rows>\n'
  );
}
