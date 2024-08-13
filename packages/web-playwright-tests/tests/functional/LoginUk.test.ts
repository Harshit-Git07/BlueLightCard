import test from "@lib/BaseTest";

test(`@Uk @SmokeTest @Web @NeedsTestCase - Login to uk home page`, async ({
  homePageUk,
}) => {
  await test.step(`Logging in to BLC Uk`, async () => {
    await homePageUk.navigateToUrlAndLogin(
      process.env.EMAIL_UK,
      process.env.PASSWORD_UK
    );
  });

  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageUk.assertElementsVisibleHomeScreenLoggedIn();
  });
});
