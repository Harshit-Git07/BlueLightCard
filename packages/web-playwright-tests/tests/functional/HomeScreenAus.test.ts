import test from "@lib/BaseTest";

test(`@Aus @SmokeTest @Web @NeedsTestCase - Check Home screen options when not logged in`, async ({
  homePageAus,
}) => {
  await test.step(`Navigating to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAus();
    await homePageAus.acceptCookies();
  });

  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageAus.assertElementsVisibleHomeScreenNotLoggedIn();
  });
});

test(`@Aus @SmokeTest @Web @NeedsTestCase - Check Home screen options when logged in`, async ({
  homePageAus,
}) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(
      process.env.EMAIL_AUS,
      process.env.PASSWORD_AUS
    );
  });

  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageAus.assertElementsVisibleHomeScreenLoggedIn();
  });
});

//Login via top button

//Login via lower button
