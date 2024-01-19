//author: Gabriel Walton
//usage: node deleteEmails.js -f <file path> OPTIONAL: -m <max number of rows>
//example: node deleteEmails.js -f packages/web/scripts/<filename>.csv -m 100
//description: deletes emails from cognito that are loaded from a csv file
//dependencies: @aws-sdk/client-cognito-identity-provider, @fast-csv/parse, dotenv
//environment variables: AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY, COGNITO_USER_POOL_ID

const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminDeleteUserCommand,
  TooManyRequestsException,
  UserNotFoundException,
} = require('@aws-sdk/client-cognito-identity-provider');

const fsp = require('fs').promises;
const fs = require('fs');
const csv = require('@fast-csv/parse');
let deletedCount = 0;
let missingCount = 0;
let tooManyCount = 0;

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

const deleteSpareEmailFromCognito = async (username, delay = 2000, retries = 3) => {
  const input = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  };
  const command = new AdminDeleteUserCommand(input);
  try {
    const response = await cognitoClient.send(command);
    deletedCount++;
    console.log(`Deleted ${deletedCount} from cognito`);
    return response;
  } catch (e) {
    if (e instanceof TooManyRequestsException) {
      if (retries === 0) {
        tooManyCount++;
        console.log(`Too many requests ${tooManyCount} from cognito`);
        return;
      }
      console.log(`Rate limit exceeded, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return deleteSpareEmailFromCognito(username, delay * 2, retries - 1);
    } else if (e instanceof UserNotFoundException) {
      missingCount++;
      console.log(`Missing ${missingCount} from cognito`);
      return;
    }
  }
};
//delete emails loaded from csv from cognito
async function deleteEmailsFromCognito() {
  let timer;
  const email_list = [];
  const csv_file = await fs
    .createReadStream(csvFilePath, 'utf8')
    .pipe(
      csv.parse({
        headers: ['email'],
        renameHeaders: true,
        maxRows: maxRows,
      })
    )
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      email_list.push(row.email);
    })
    .on('end', async () => {
      for (const email of email_list) {
        await deleteSpareEmailFromCognito(email);
        timer = setTimeout(() => {
          clearTimeout(timer);
        }, 5000);
      }
      console.log(`Deleted ${deletedCount} from cognito`);
      console.log(`Missing ${missingCount} from cognito`);
      console.log(`Too many requests ${tooManyCount} from cognito`);
      clearTimeout(timer);
    });
}

if (csvFilePath) {
  deleteEmailsFromCognito();
} else {
  console.log('\nUsage: node deleteEmails.js -f <file path> OPTIONAL: -m <max number of rows>\n');
}
