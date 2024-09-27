import test from '@lib/BaseTest';

test(`@Aus @SmokeTest @Web - User changes mobile number`, async ({ homePageAus, myAccountPageAus }) => {
  await test.step(`Logging in to BLC AUS`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });
//Updates mobile number and verifies the updated number
  await test.step('Change mobile number', async () => {
    await myAccountPageAus.navigateToMyAccountAus();
    await myAccountPageAus.updateMobileNumberAndVerifyChangesSaved();
  });
});
