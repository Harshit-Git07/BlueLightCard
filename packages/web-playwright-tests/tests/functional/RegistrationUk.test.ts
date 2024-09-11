import test from '@lib/BaseTest';
import { User } from 'utils/functional/dataModels/dataModelsUk';
import { EmailUtil } from 'utils/functional/emailUtil';

test(`@Uk @SmokeTest @Web @NeedsMappedToManualTestCase - Generate user without uploading id or making payment`, async ({
  registrationPageUk,
  webActions,
}) => {
  await test.step(`Generating new user details`, async () => {
    const user = new User();
    console.log(`Generated User: ${JSON.stringify(user, null, 2)}`);

    await test.step(`Opening the BLC UK page and going thorough the registration page`, async () => {
      await registrationPageUk.registerNewUserWithoutIdOrPayment(user);
    });

    await test.step(`Get BLC email confirmation link via API call to mailbox and open it - confirm user is returned to correct page `, async () => {
      await registrationPageUk.navigateToRegistrationFromLink(
        await EmailUtil.returnEmailValidationLink(user.email),
      );

      await webActions.verifyPageUrlContains('/uploadid.php');
    });
  });
});
