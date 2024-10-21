

import test from '@lib/BaseTest';
import { generateUKMobileNumber, generateUKService } from 'utils/functional/dataModels/dataModelsUk';

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

test(`@Uk @SmokeTest @Web - User changes selected Service`, async ({ myAccountPageUk }) => {
  await test.step('Change UK Service', async () => {
    const { service, text } = generateUKService();
    await myAccountPageUk.navigateToMyAccountUk();
    await myAccountPageUk.updateSelectedService(service, text);
    await myAccountPageUk.verifyServiceUpdated(text);
  });
});

