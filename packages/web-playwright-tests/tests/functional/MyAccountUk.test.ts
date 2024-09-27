import test from '@lib/BaseTest';


test(`@Uk @SmokeTest @Web - User changes mobile number`, async ({ homePageUk, myAccountPageUk }) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePageUk.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
  });

   await test.step('Change mobile number', async () => {
    await myAccountPageUk.navigateToMyAccountUk();
    await myAccountPageUk.updateMobileNumberAndVerifyChangesSaved();
  });
});

