import test from "@lib/BaseTest";


test.beforeEach(async ({homePagePreLoginUK }) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePagePreLoginUK.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
});

});

test(`@Uk @SmokeTest @Web @NeedsTestCase - Login to uk home page`, async ({
   homePageUk
}) => {

  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageUk.assertElementsVisibleHomeScreenLoggedIn();
  });
});

test(`@Uk @SmokeTest @Web @NeedsTestCase - Verify user is able to view all features on members home page`, async ({
  homePageUk, 
}) => {
  
  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageUk.assertCarouselsVisibleHomeScreenLoggedIn();
  });
});


