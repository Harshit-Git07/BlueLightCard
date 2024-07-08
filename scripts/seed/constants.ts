import { z } from 'zod';

export const env = z
  .object({
    AWS_REGION: z.string().optional(),
  })
  .parse(process.env);

export const cliArgs = process.argv.slice(2);

export const SST_OUTPUT_JSON = '.sst/outputs.json';
export const TEST_DATA_DIR = './data';
export const DOTENV_WEB = 'packages/web/.env';

export const SEARCH_MOCK_DATA_FILE = './data/searchMockData.json';
export const SEARCH_MOCK_DATA_ENDPOINT = 'http://localhost:3001';

export const REGION = env.AWS_REGION ?? 'eu-west-2';

export const BLC_EMAIL_DOMAIN = 'bluelightcard.co.uk';

export const STACK_COGNITO_POOL_CLIENT = 'cognitoNewUserPoolwebClient';
export const EVENT_SOURCE_USER_MIGRATED = 'user.signin.migrated';
export const EVENT_SOURCE_BANNERS_CREATE = 'banner.created';
