const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const fs = require('fs').promises;

require('dotenv').config();

const COGNITO_USERS_PAGINATION_TOKEN_FILE_PATH = './cognitoUsersPaginationToken.txt';

const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

const cognitoClient = new CognitoIdentityProviderClient(config);

async function replacePaginationTokenInFile(paginationToken) {
  await fs.writeFile(COGNITO_USERS_PAGINATION_TOKEN_FILE_PATH, paginationToken, 'utf8');
}

async function getUserFromCognito(paginationToken) {
  const input = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    AttributesToGet: ['custom:blc_old_id', 'custom:blc_old_uuid', 'email'],
  };

  if (paginationToken) {
    input.PaginationToken = paginationToken;
  }

  const getUserPromise = async (user) => {
    const uuidAttribute = user.Attributes.find(({ Name }) => Name === 'custom:blc_old_id');
    const idAttribute = user.Attributes.find(({ Name }) => Name === 'custom:blc_old_uuid');
    const emailAttribute = user.Attributes.find(({ Name }) => Name === 'email');

    const appendString =
      uuidAttribute.Value + ',' + idAttribute.Value + ',' + emailAttribute.Value + '\n';
    await fs.appendFile(process.env.ALL_COGNITO_EMAILS_FILE_NAME, appendString);
  };

  const command = new ListUsersCommand(input);
  const response = await cognitoClient.send(command);
  await Promise.all(response.Users.map(getUserPromise));

  return response.PaginationToken;
}

(async () => {
  const paginationTokenFile = await fs.readFile(COGNITO_USERS_PAGINATION_TOKEN_FILE_PATH, 'utf8');
  let paginationToken = paginationTokenFile ? paginationTokenFile : '';

  do {
    paginationToken = await getUserFromCognito(paginationToken);
    if (paginationToken) await replacePaginationTokenInFile(paginationToken);
  } while (paginationToken);

  console.log('finished');
})();
