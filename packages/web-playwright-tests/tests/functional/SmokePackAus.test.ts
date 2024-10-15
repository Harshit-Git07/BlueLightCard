import test from '@lib/BaseTest';



test.beforeEach(async ({homePagePreLoginAUS}) => {
  await test.step(`Logging in to BLC AUS`, async () => {
    await homePagePreLoginAUS.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
});
});
test(`@Aus @SmokeTest @Web - BLC aus Existing User - Redeem offer`, async ({ membersHomeAus }) => {


  await test.step(`Performing the search for 'Enterprise Rent-A-Car'`, async () => {
    await membersHomeAus.searchForCompanyCategoryOrPhrase('Company', 'Enterprise Rent-A-Car');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await membersHomeAus.clickToSeeTheDiscount('https://partners.rentalcar.com/blca/');
  });
});

