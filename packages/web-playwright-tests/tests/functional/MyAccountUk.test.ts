

import test from '@lib/BaseTest';
import { generateUKMobileNumber } from 'utils/functional/dataModels/dataModelsUk';

test.beforeEach(async ({ homePagePreLoginUK }) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePagePreLoginUK.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
  });
});

test(`@Uk @SmokeTest @Web - User changes mobile number`, async ({ myAccountPageUk }) => {
  await test.step('Change mobile number', async () => {
    const newMobileNumber = generateUKMobileNumber();
    await myAccountPageUk.navigateToMyAccountUk();
    await myAccountPageUk.updateMobileNumber(newMobileNumber);
    await myAccountPageUk.verifyMobileNumberUpdated(newMobileNumber);
  });
});
