import test from '@lib/BaseTest';
import { HomePagePreLoginAUS } from '@pages/HomePagePreLoginAUS';
import { generateAUSMobileNumber } from 'utils/functional/dataModels/dataModelsAus';


test.beforeEach(async ({homePagePreLoginAUS }) => {
  await test.step(`Logging in to BLC AUS`, async () => {
    await homePagePreLoginAUS.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
});
});

test(`@Aus @SmokeTest @Web - User changes mobile number`, async ({ myAccountPageAus }) => {
  
//Updates mobile number and verifies the updated number
  await test.step('Change mobile number', async () => {
 
   const newMobileNumber = generateAUSMobileNumber();
    await myAccountPageAus.navigateToMyAccountAus();
    await myAccountPageAus.updateMobileNumber(newMobileNumber);
    await myAccountPageAus.verifyMobileNumberUpdated(newMobileNumber);
  });

});

