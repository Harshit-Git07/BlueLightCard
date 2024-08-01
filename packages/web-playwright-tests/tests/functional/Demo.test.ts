import test from "@lib/BaseTest";
test(`@Uk @Smoke @Web @NeedsTestCase - Check Home screen options when not logged in - Demo`, async ({
  homePageUk,
}) => {
  await test.step(`Navigating to BLC Uk`, async () => {
    await homePageUk.navigateToUrlUk();
    await homePageUk.acceptCookies();
  });

  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageUk.assertElementsVisibleHomeScreenNotLoggedIn();
  });
});

test(`@Uk @Smoke @Web @NeedsTestCase - Check Home screen options when logged in - Demo`, async ({
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

test(`@Aus @Smoke @Web Click the 'Brand Partner - Partner with us' button and check redirected to the correct url `, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Navigating to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAus();
    await homePageAus.acceptCookies();
  });

  await test.step(`Clicking on the 'Brand Partner - Partner with us' button and checking that user is redirected to the correct page - demo`, async () => {
    await homePageAus.clickPartnerWithUsButton();
    await webActions.verifyPageUrlContains("FAILTEST");
  });
});
