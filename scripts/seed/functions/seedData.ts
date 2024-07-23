import { v5 } from 'uuid';
import { REGION } from '../constants';
import { logger } from '../instances';
import { createUser, getUserPoolClient, getUserPoolClientSecret } from './cognito';
import { getFlagValue } from '../utils';
import { BRANDS } from '@blc-mono/core/types/brands.enum';
import { triggerBannersEvent, triggerCognitoMigration } from './eventBridge';
import { uploadTestFilesS3 } from './s3';

type BrandsEnumKey = keyof typeof BRANDS;

// This is the dev account id and only account script will need to use.
const ACCOUNT_ID = '314658777488';

export const seedData = async (
  devName: string,
  identityApiEndpoint: string,
  cognitoUserPoolWebClient: string,
  stackCognitoPoolClient: string,
  offersApiEndpoint: string,
  eventBusName: string,
  isBackendSharedDeployed: boolean,
  isBackendOffersDeployed: boolean,
) => {
  // user ids
  const uuid = v5(devName, v5.URL);
  const legacyUserId = 12345;
  const brand = getFlagValue('brand') ?? BRANDS.BLC_UK;

  const s3MenusBucket = `menus-${devName}-${REGION}-${ACCOUNT_ID}`;

  logger.info({ message: 'Started to seed environment' });
  logger.info({
    message: `Seeding with values: IAE: ${identityApiEndpoint}, CUPWC: ${cognitoUserPoolWebClient}, OAE: ${offersApiEndpoint}, EBN: ${eventBusName}`,
  });

  // setup test user in the specified cognito user pool
  const client = await getUserPoolClient(cognitoUserPoolWebClient, stackCognitoPoolClient);

  if (!client?.ClientId) {
    throw new Error(`User pool integration '${stackCognitoPoolClient}' not found`);
  }

  const clientSecret = await getUserPoolClientSecret(cognitoUserPoolWebClient, client.ClientId);

  if (!clientSecret) {
    throw new Error('User pool client secret not available');
  }

  const cognitoUserCreds = await createUser(cognitoUserPoolWebClient, {
    usernamePrefix: devName,
    legacyUserId,
    uuid,
  });

  // get brand key from the brand value, migration lambda expects this as the brand value i.e blc-uk -> BLC_UK
  const toBrandEnumKey = Object.keys(BRANDS).find((key) => BRANDS[key as BrandsEnumKey] === brand);

  // with this eventBusName possibly being a fallback, could we end up with too many events going to the same endpoint?
  await triggerCognitoMigration(eventBusName, {
    uuid,
    name: devName,
    brand: toBrandEnumKey ?? 'BLC_UK',
    legacyUserId,
  });

  if (isBackendSharedDeployed) {
    await triggerBannersEvent(eventBusName, brand);
  }

  if (isBackendOffersDeployed) {
    // Uploading Test Files relies on offers api endpoint
    await uploadTestFilesS3(s3MenusBucket);
  }

  logger.info({ message: '------------------------------------------------------------' });
  logger.info({ message: ` > Login Test Username: ${cognitoUserCreds.username}` });
  logger.info({ message: ` > Login Test Password: ${cognitoUserCreds.password}` });
  logger.info({ message: '------------------------------------------------------------' });
  return {
    client,
    clientSecret,
    cognitoUserCreds,
  };
};
