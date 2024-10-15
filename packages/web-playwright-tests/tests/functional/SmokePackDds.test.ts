import test from '@lib/BaseTest';


test.beforeEach(async ({homePagePreLoginDDS }) => {
  await test.step(`Logging in to DDS`, async () => {
  await homePagePreLoginDDS.navigateToUrlAndLogin(process.env.EMAIL_DDS, process.env.PASSWORD_DDS);
});
});


test(`@Dds @SmokeTest @Web - DDS Existing User - Redeem offer`, async ({ membersHomeDds }) => {


  await test.step(`Performing the search for British Airways`, async () => {
    await membersHomeDds.searchForCompanyCategoryOrPhrase('Phrase', 'British Airways');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await membersHomeDds.clickToSeeTheDiscount('BAHERO', 'britishairways.com');
  });
});

