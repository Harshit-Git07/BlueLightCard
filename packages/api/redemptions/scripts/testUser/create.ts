import { readFile, writeFile } from 'node:fs/promises';

import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';

import { TestUser } from '../../libs/test/helpers/identity';

import { TEST_USER_FILE } from './constants';

const logger = new CliLogger();

async function main() {
  try {
    await readFile(TEST_USER_FILE, 'utf8');
    logger.error({
      message:
        'Test user already exists. Please remove the user with `npm run -w packages/api/redemptions deleteTestUser` before running this script.',
    });
    process.exit(1);
  } catch {
    /* no action needed */
  }

  logger.info({
    message: 'Creating test user',
  });

  const user = await TestUser.create();

  logger.info({
    message: 'Saving test user to file',
  });

  await writeFile(TEST_USER_FILE, JSON.stringify(user.userDetail), 'utf8');

  logger.info({
    message: 'Test user saved to file',
  });

  logger.info({
    message:
      'Saved test user to file. You can now generate a token for this user using `npm run -w packages/api/redemptions authenticateTestUser`',
  });
}

main();
