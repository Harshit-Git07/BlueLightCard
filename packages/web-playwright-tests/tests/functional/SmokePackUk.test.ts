import test from '@lib/BaseTest';

test.beforeEach(async ({homePagePreLoginUK }) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePagePreLoginUK.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
});

});



test(`@Uk @SmokeTest @Web - BLC UK Existing User - Redeem offer - 004`, async ({ membersHomeUk }) => {


  await test.step(`Performing the search for Pets At Home`, async () => {
    await membersHomeUk.searchForCompanyCategoryOrPhrase('Company', 'Pets At Home');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await membersHomeUk.clickToSeeTheDiscount('BLC10', 'petsathome.com');
  });

});

