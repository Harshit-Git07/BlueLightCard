import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { logger } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

export interface BrazeServiceJson {
  BRAZE_SERVICE_API_KEY: string;
  BRAZE_SERVICE_SERVICE_SMS_CAMPAIGN_ID: string;
  BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID: string;
}

let brazeServiceJsonSingleton: BrazeServiceJson;

export async function brazeServiceJson(): Promise<BrazeServiceJson | undefined> {
  if (!brazeServiceJsonSingleton) {
    const maybeBrazeServiceJson = await loadSecret();
    if (!maybeBrazeServiceJson) return undefined;

    brazeServiceJsonSingleton = maybeBrazeServiceJson;
  }

  return brazeServiceJsonSingleton;
}

async function loadSecret(): Promise<BrazeServiceJson | undefined> {
  try {
    const command = new GetSecretValueCommand({ SecretId: getSecretId() });
    const secretsManager = new SecretsManagerClient();
    const secretsManagerResult = await secretsManager.send(command);

    const asString = secretsManagerResult.SecretString;
    if (!asString) return undefined;

    const asObject = JSON.parse(asString);
    if (!isBrazeServiceJson(asObject)) return undefined;

    return asObject;
  } catch (error) {
    logger.error({ message: 'Failed to load braze service json from secrets manager', error });
  }
}

function getSecretId(): string {
  switch (getBrandFromEnv()) {
    case 'BLC_UK':
      return 'blc-mono/braze-service-json-blc-uk';
    case 'BLC_AU':
      return 'blc-mono/braze-service-json-blc-au';
    case 'DDS_UK':
      return 'blc-mono/braze-service-json-dds-uk';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBrazeServiceJson(maybeBrazeServiceJson: any): maybeBrazeServiceJson is BrazeServiceJson {
  if (typeof maybeBrazeServiceJson !== 'object') return false;

  return (
    maybeBrazeServiceJson.BRAZE_SERVICE_API_KEY !== undefined &&
    maybeBrazeServiceJson.BRAZE_SERVICE_SERVICE_SMS_CAMPAIGN_ID !== undefined &&
    maybeBrazeServiceJson.BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID !== undefined
  );
}
