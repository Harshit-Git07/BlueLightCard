import test from '@lib/BaseTest';

test(`@Aus @SmokeTest @Web - BLC aus Existing User - Redeem offer`, async ({ homePageAus }) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });

  await test.step(`Performing the search for 'Enterprise Rent-A-Car'`, async () => {
    await homePageAus.searchForCompanyCategoryOrPhrase('Company', 'Enterprise Rent-A-Car');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await homePageAus.clickToSeeTheDiscount('https://partners.rentalcar.com/blca/');
  });
});
