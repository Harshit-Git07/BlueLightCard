import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { S3Client } from '@aws-sdk/client-s3';
import { REGION } from './constants';
import { CliLogger } from '@blc-mono/core/src/utils/logger/cliLogger';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

export const cognitoIdpClient = new CognitoIdentityProviderClient({
  region: REGION,
});

export const s3Client = new S3Client({
  region: REGION,
});

export const eventBridgeClient = new EventBridgeClient({
  region: REGION,
});

export const logger = new CliLogger();
