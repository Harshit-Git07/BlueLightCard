import test from '@lib/BaseTest';

test(`@Uk @SmokeTest @Web - BLC UK Existing User - Redeem offer - 004`, async ({ homePageUk }) => {
  await test.step(`Logging in to BLC Uk`, async () => {
    await homePageUk.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
  });

  await test.step(`Performing the search for Pets At Home`, async () => {
    await homePageUk.searchForCompanyCategoryOrPhrase('Company', 'Pets At Home');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await homePageUk.clickToSeeTheDiscount('BLC10', 'petsathome.com');
  });
});
