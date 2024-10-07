import test from '@lib/BaseTest';
import { HomePageLoggedInDds } from '@pages/HomePageLoggedInDds';

test.beforeEach(async ({homePagePreLoginDDS }) => {
  await test.step(`Logging in to DDS`, async () => {
  await homePagePreLoginDDS.navigateToUrlAndLogin(process.env.EMAIL_DDS, process.env.PASSWORD_DDS);
});
});


test(`@Dds @SmokeTest @Web - DDS Existing User - Redeem offer`, async ({ homePageLoggedInDds }) => {


  await test.step(`Performing the search for British Airways`, async () => {
    await homePageLoggedInDds.searchForCompanyCategoryOrPhrase('Phrase', 'British Airways');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await homePageLoggedInDds.clickToSeeTheDiscount('BAHERO', 'britishairways.com');
  });
});

