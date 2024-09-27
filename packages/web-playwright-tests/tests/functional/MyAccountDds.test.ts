import test from '@lib/BaseTest';

test(`@Dds @SmokeTest @Web - User changes mobile number`, async ({ homePageDds }) => {
  await test.step(`Logging in to DDS`, async () => {
    await homePageDds.navigateToUrlAndLogin(process.env.EMAIL_DDS, process.env.PASSWORD_DDS);
  });

  await test.step('Change mobile number', async () => {
    await homePageDds.changeMobileNumber(process.env.EMAIL_DDS, process.env.PASSWORD_DDS);
  });
});
