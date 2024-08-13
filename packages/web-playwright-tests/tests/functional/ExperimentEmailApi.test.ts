import test from "@lib/BaseTest";
import { User } from "utils/functional/dataModels/dataModelsUk";

test(`@Uk @SmokeTest @Web @NeedsTestCase - Generate and sign in with a user`, async ({
  registrationPageUk,
}) => {
  await test.step(`Generating new user details`, async () => {
    const user = new User();
    console.log(`Generated User: ${JSON.stringify(user, null, 2)}`);

    await test.step(`Opening the BLC UK page and going thorough the registration page`, async () => {
      await registrationPageUk.registerNewUserWithoutIdOrPayment(user);
    });

    //Get BLC link via API and confirm
  });
});
