// commented this until its needed
// import { readFile, rm } from 'node:fs/promises';
//
// import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
//
// import { TestUser, TestUserDetailsSchema } from '../../libs/test/helpers/identity';
//
// import { TEST_USER_FILE } from './constants';
//
// const logger = new CliLogger();
//
// async function main() {
//   logger.info({
//     message: 'Reading test user details from disk',
//   });
//
//   let testUserData: string;
//   try {
//     testUserData = await readFile(TEST_USER_FILE, 'utf8');
//   } catch {
//     logger.error({
//       message: 'There is no test user to delete',
//     });
//     process.exit(1);
//   }
//
//   logger.info({
//     message: 'Validating test user details',
//   });
//
//   const testUserDetails = TestUserDetailsSchema.parse(JSON.parse(testUserData));
//   const testUser = new TestUser(testUserDetails);
//
//   logger.info({
//     message: 'Deleting test user',
//   });
//
//   await testUser.delete();
//
//   logger.info({
//     message: 'Removing test user file',
//   });
//
//   await rm(TEST_USER_FILE);
//
//   logger.info({
//     message: 'Test user file removed',
//   });
// }
//
// main();
