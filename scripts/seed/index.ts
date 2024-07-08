import { v5 } from 'uuid';
import {
  DOTENV_WEB,
  REGION,
  SEARCH_MOCK_DATA_ENDPOINT,
  STACK_COGNITO_POOL_CLIENT,
  cliArgs,
} from './constants';
import { logger } from './instances';
import { getFlagValue, getValues, updateEnvFile } from './utils';
import { createUser, getUserPoolClient, getUserPoolClientSecret } from './functions/cognito';
import { uploadTestFilesS3 } from './functions/s3';
import { triggerBannersEvent, triggerCognitoMigration } from './functions/eventBridge';
import { BRANDS } from '@blc-mono/core/types/brands.enum';
import MockServer from './server';

type BrandsEnumKey = keyof typeof BRANDS;

// This is the dev account id and only account script will need to use.
const ACCOUNT_ID = '314658777488';

async function main() {
  const devName = cliArgs[0];
  const brand = getFlagValue('brand') ?? BRANDS.BLC_UK;

  // user ids
  const uuid = v5(devName, v5.URL);
  const legacyUserId = 12345;

  const s3MenusBucket = `menus-${devName}-${REGION}-${ACCOUNT_ID}`;

  logger.info({ message: 'Started to seed environment' });

  const sst = getValues([
    'IdentityApiEndpoint',
    'CognitoUserPoolWebClient',
    'OffersApiEndpoint',
    'EventBusName',
  ]);

  // setup test user in the specified cognito user pool
  const client = await getUserPoolClient(sst.CognitoUserPoolWebClient, STACK_COGNITO_POOL_CLIENT);

  if (!client?.ClientId) {
    throw new Error(`User pool integration '${STACK_COGNITO_POOL_CLIENT}' not found`);
  }

  const clientSecret = await getUserPoolClientSecret(sst.CognitoUserPoolWebClient, client.ClientId);

  if (!clientSecret) {
    throw new Error('User pool client secret not available');
  }

  const cognitoUserCreds = await createUser(sst.CognitoUserPoolWebClient, {
    usernamePrefix: devName,
    legacyUserId,
    uuid,
  });

  // get brand key from the brand value, migration lambda expects this as the brand value i.e blc-uk -> BLC_UK
  const toBrandEnumKey = Object.keys(BRANDS).find((key) => BRANDS[key as BrandsEnumKey] === brand);

  await triggerCognitoMigration(sst.EventBusName, {
    uuid,
    name: devName,
    brand: toBrandEnumKey ?? 'BLC_UK',
    legacyUserId,
  });

  await triggerBannersEvent(sst.EventBusName, brand);

  // upload test data files to the s3 bucket
  await uploadTestFilesS3(s3MenusBucket);

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
}

main().catch((error) => {
  logger.error({ message: 'Seed script error', error });
  process.exit(1);
});
