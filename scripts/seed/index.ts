import { cliArgs, RUN_IN_CI } from './constants';
import { logger } from './instances';
import { ciSeed } from './ciSeed';
import { localSeed } from './localSeed';

async function main() {
  /* 
    The npm run seed script still works as it used.
    However, it has now been adapted to be able to run within a CI environment.
    To run in the CI environment, an environment variable named RUN_IN_CI must be set to true.
    npm run seed -- [devName]
    Where [devName] is a string.
  */
  const runCI = RUN_IN_CI === 'true' ? true : false;
  const [devName] = cliArgs;
  if (!devName) {
    throw new Error('Please provide a dev name within the cli arguments');
  }
  if (runCI) {
    logger.info({ message: `Running Seeding Script for CI Environment` });
    await ciSeed(devName);
  } else {
    logger.info({ message: `Running Seeding Script for Local Environment` });
    await localSeed(devName);
  }
}

main().catch((error) => {
  logger.error({ message: 'Seed script error', error });
  process.exit(1);
});
