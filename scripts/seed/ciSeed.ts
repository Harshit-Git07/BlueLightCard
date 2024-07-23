import fs from 'fs';
import { EOL } from 'os';
import { seedData } from './functions/seedData';
import { STACK_COGNITO_POOL_CLIENT } from './constants';

// This is the dev account id and only account script will need to use.
const ACCOUNT_ID = '314658777488';

export const ciSeed = async (devName: string) => {
  const identityApiEndpoint = process.env.IDENTITY_API_URL; // this is either the deployed pr url or the fallback url in which will be staging env for the moment
  const cognitoUserPoolWebClient = process.env.COGNITO_POOL_WEB_CLIENT;
  const offersApiEndpoint = process.env.OFFERS_API_ENDPOINT;
  const eventBusName = process.env.EVENT_BUS_NAME;
  const backendSharedDeployed = process.env.BACKEND_SHARED_DEPLOYED?.toLowerCase() === 'true';
  const backendOffersDeployed = process.env.BACKEND_OFFERS_DEPLOYED?.toLocaleLowerCase() === 'true';
  const stackCognitoPoolClient = process.env.STACK_COGNITO_POOL_CLIENT ?? STACK_COGNITO_POOL_CLIENT;
  if (
    !devName ||
    !identityApiEndpoint ||
    !cognitoUserPoolWebClient ||
    !offersApiEndpoint ||
    !eventBusName
  ) {
    throw new Error('Environment Variables Not Set Correctly');
  }
  const { client, clientSecret, cognitoUserCreds } = await seedData(
    devName,
    identityApiEndpoint,
    cognitoUserPoolWebClient,
    stackCognitoPoolClient,
    offersApiEndpoint,
    eventBusName,
    backendSharedDeployed,
    backendOffersDeployed,
  );
  // Making Variables accessible to other jobs in CI
  // How does this work with security? Are we ok to expose these secrets within the workflows?
  const outputs = [
    `clientId=${client.ClientId}`,
    `cognitoSecret=${clientSecret}`,
    `testUsername=${cognitoUserCreds.username}`,
    `testPassword=${cognitoUserCreds.password}`,
  ];
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, outputs.join(EOL));
  }
};
