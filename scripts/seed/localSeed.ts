import { DOTENV_WEB, SEARCH_MOCK_DATA_ENDPOINT, STACK_COGNITO_POOL_CLIENT } from './constants';
import { seedData } from './functions/seedData';
import { logger } from './instances';
import MockServer from './server';
import { getValues, updateEnvFile } from './utils';

export const localSeed = async (devName: string) => {
  const sst = getValues([
    'IdentityApiEndpoint',
    'CognitoUserPoolWebClient',
    'OffersApiEndpoint',
    'EventBusName',
  ]);
  const { client, clientSecret, cognitoUserCreds } = await seedData(
    devName,
    sst.IdentityApiEndpoint,
    sst.CognitoUserPoolWebClient,
    STACK_COGNITO_POOL_CLIENT,
    sst.OffersApiEndpoint,
    sst.EventBusName,
    true,
    true,
  );
  if (!client?.ClientId) {
    throw new Error(`User pool integration '${STACK_COGNITO_POOL_CLIENT}' not found`);
  }
  // update the users .env file with the generated aws values from sst
  updateEnvFile(
    {
      NEXT_PUBLIC_IDENTITY_API_URL: sst.IdentityApiEndpoint,
      NEXT_PUBLIC_COGNITO_CLIENT_ID: client.ClientId,
      NEXT_PUBLIC_COGNITO_CLIENT_SECRET: clientSecret,
      NEXT_PUBLIC_COGNITO_IDP_ID: sst.CognitoUserPoolWebClient,
      NEXT_PUBLIC_OFFERS_ENDPOINT: sst.OffersApiEndpoint,
      NEXT_PUBLIC_SEARCH_ENDPOINT: SEARCH_MOCK_DATA_ENDPOINT,
    },
    DOTENV_WEB,
  );
  logger.info({ message: '------------------------------------------------------------' });
  logger.info({ message: ` > Login Test Username: ${cognitoUserCreds.username}` });
  logger.info({ message: ` > Login Test Password: ${cognitoUserCreds.password}` });
  logger.info({ message: '------------------------------------------------------------' });
  logger.info({ message: 'Starting mock server...' });

  const mockServer = new MockServer(SEARCH_MOCK_DATA_ENDPOINT);
  await mockServer.start();
};
