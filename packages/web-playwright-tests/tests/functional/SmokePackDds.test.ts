import test from '@lib/BaseTest';

test(`@Dds @SmokeTest @Web - DDS Existing User - Redeem offer`, async ({ homePageDds }) => {
  await test.step(`Logging in to DDS`, async () => {
    await homePageDds.navigateToUrlAndLogin(process.env.EMAIL_DDS, process.env.PASSWORD_DDS);
  });

  await test.step(`Performing the search for British Airways`, async () => {
    await homePageDds.searchForCompanyCategoryOrPhrase('Phrase', 'British Airways');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await homePageDds.clickToSeeTheDiscount('BAHERO', 'britishairways.com');
  });
});
