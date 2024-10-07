import test from "@lib/BaseTest";

test(`@Uk @SmokeTest @Web @NeedsTestCase - Cannot login to uk home page - due to wrong password`, async ({
  homePagePreLoginUK,
}) => {
  await test.step(`Logging in to BLC Uk - Sending wrong password`, async () => {
    await homePagePreLoginUK.navigateToUrlAndLogin(
      process.env.EMAIL_UK, "wrongpassword"
    );
  });

  await test.step(`Asserting the incorrect username of password element appears`, async () => {
    await homePagePreLoginUK.assertIncorrectLoginDetailsElementsArePresent();
  });
});

test(`@Uk @SmokeTest @Web @NeedsTestCase - Check Home screen options when not logged in`, async ({
  homePagePreLoginUK,
}) => {
  await test.step(`Navigating to BLC Uk`, async () => {
    await homePagePreLoginUK.navigateToUrlUk();
    await homePagePreLoginUK.acceptCookies();
  });

  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePagePreLoginUK.assertElementsVisibleHomeScreenNotLoggedIn();
  });
});
