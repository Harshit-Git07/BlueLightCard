import test from '@lib/BaseTest';


test.beforeEach(async ({homePagePreLoginDDS }) => {
  await test.step(`Logging in to DDS`, async () => {
    await homePagePreLoginDDS.navigateToUrlAndLogin(process.env.EMAIL_DDS, process.env.PASSWORD_DDS);
});
});

test (`@Dds @SmokeTest @Web @NeedsTestCase - Login to dds home page and verify elements on screen`, async ({ membersHomeDds }) => {
  await membersHomeDds.assertElementsVisibleHomeScreenLoggedIn();
  });
