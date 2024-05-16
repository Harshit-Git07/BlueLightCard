import { readFile } from 'node:fs/promises';

import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';

import { TestUser, TestUserDetailsSchema } from '../../libs/test/helpers/identity';

import { TEST_USER_FILE } from './constants';

const logger = new CliLogger();

async function main() {
  logger.info({
    message: 'Reading test user details from disk',
  });

  let testUserData: string;
  try {
    testUserData = await readFile(TEST_USER_FILE, 'utf8');
  } catch {
    logger.error({
      message:
        'There is no test user to authenticate. Please create a test user with `npm run -w packages/api/redemptions createTestUser` before running this script.',
    });
    process.exit(1);
  }

  logger.info({
    message: 'Validating test user details',
  });

  const testUserDetails = TestUserDetailsSchema.parse(JSON.parse(testUserData));
  const testUser = new TestUser(testUserDetails);

  logger.info({
    message: 'Authenticating test user',
  });

  const tokens = await testUser.authenticate();

  logger.info({
    message: 'Test user authenticated',
  });

  logger.info({
    message: `ID Token:\n${tokens.idToken}`,
  });

  logger.info({
    message: `Access Token:\n${tokens.accessToken}`,
  });
}

main();
