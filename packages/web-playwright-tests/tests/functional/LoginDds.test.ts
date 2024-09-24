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

test(`@Dds @SmokeTest @Web @NeedsTestCase - Verify that incorrect password warning appears`, async ({ homePageDds }) => {
  await test.step(`Logging in to DDS`, async () => {
    await homePageDds.navigateToUrlAndLogin(process.env.EMAIL_DDS,
     "wrongpassword");
  });

 
  await test.step(`Asserting the incorrect username of password element appears`, async () => {
    await homePageDds.assertIncorrectLoginDetailsElementsArePresent();
  });
});

