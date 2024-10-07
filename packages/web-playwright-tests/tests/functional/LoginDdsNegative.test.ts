import test from '@lib/BaseTest';

test(`@Dds @SmokeTest @Web @NeedsTestCase - Verify that incorrect password warning appears`, async ({ homePagePreLoginDDS }) => {
  await test.step(`Logging in to DDS`, async () => {
    await homePagePreLoginDDS.navigateToUrlAndLogin(process.env.EMAIL_DDS,
     "wrongpassword");
  });

 
  await test.step(`Asserting the incorrect username of password element appears`, async () => {
    await homePagePreLoginDDS.assertIncorrectLoginDetailsElementsArePresent();
  });
});


