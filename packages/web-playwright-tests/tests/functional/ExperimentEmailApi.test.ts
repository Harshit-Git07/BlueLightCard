import test from "@lib/BaseTest";
import { EmailUtil } from "utils/functional/emailUtil";
import { User } from "utils/functional/dataModels/dataModelsUk";

// test("Generate and use a random user with UK address", () => {
//   const user = new User();
//   console.log(`Generated User: ${JSON.stringify(user, null, 2)}`);
// });

// test("Go through the BLC front end and setup the user account", () => {
//   //TODO
//   //await RegistrationPage.registerNewUserWithoutIdOrPayment
// });

// test("Setup and validate emails", async () => {
//   // let tag = EmailUtil.generateTag();
//   let tag = "test";

//   try {
//     await EmailUtil.setupAndValidateEmails(tag);
//   } catch (error) {
//     console.error("Error during email setup and validation:", error);
//     throw error; // Rethrow the error to fail the test
//   }
// });

///

test(`@Uk @Smoke @Web @NeedsTestCase - Generate and sign in with a user`, async ({
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
