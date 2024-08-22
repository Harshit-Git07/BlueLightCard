import test from '@lib/BaseTest';

test(`@Dds @SmokeTest @Web @NeedsTestCase - Login to dds home page`, async ({ homePageDds }) => {
  await test.step(`Logging in to DDS`, async () => {
    await homePageDds.navigateToUrlAndLogin(process.env.EMAIL_DDS,
      process.env.PASSWORD_DDS);
  });

  await test.step(`Asserting the expected elements are visible on the Home screen`, async () => {
    await homePageDds.assertElementsVisibleHomeScreenLoggedIn();
  });
});
