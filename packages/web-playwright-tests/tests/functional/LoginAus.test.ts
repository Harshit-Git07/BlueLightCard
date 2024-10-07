import test from '@lib/BaseTest';



test.beforeEach(async ({homePagePreLoginAUS }) => {
  await test.step(`Logging in to BLC AUS`, async () => {
    await homePagePreLoginAUS.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
});
});

test(`@Aus @SmokeTest @Web @NeedsTestCase - Login to aus home page`, async ({ homePageLoggedInAus }) => {


  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageLoggedInAus.assertElementsVisibleHomeScreenLoggedIn();
  });
});



