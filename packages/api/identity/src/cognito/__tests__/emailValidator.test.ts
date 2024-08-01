import { isValidEmail } from "../emailValidator";

describe('validateEmail', () => {
  const listOfValidEmails = [
    'test-565+test@gmail.com',
    'test.user445@hotmail.co.uk',
    'test_1@hotmail.com',
    'test.user1@place.company.uk',
    'oldemailtest@yahoo.com',
    'clouds@sky.com',
    'sky@icloud.me',
    'Some.Capitals@ADB.def.uk',
    'outlookuser123@outlook.com',
    'random.domain@blueyonder.co.uk',
    'dash.in-domain@abc-ef.abc.uk',
    'long.domain@longpartnership.abc.uk'
  ]

  // most of these are taken from real data but with no PII
  const listOfInvalidEmails = [
    'testuser121173&gmail.com',
    'forgottheat1656live.com',
    'Bluelightcard',
    'blue light',
    'email withspace@domain.co.uk',
    'space@ domain.co.uk',
    'space@domain .com',
    'comma@domain,com',
    'test&user@domain.com',
    'test!user@domain.com',
    'test£user@domain.com',
    'test#user@domain.com',
    'test^user@domain.com',
    'test*user@domain.com',
    'test(user@domain.com',
    'test)user@domain.com',
    'test=user@domain.com',
    'test@mydomaincom'
  ]

  listOfValidEmails.forEach((email: string) => {
    it(`should return true for valid email of [${email}]`, async () => {
      const result = isValidEmail(email);

      expect(result).toBeTruthy();
    });
  })

  listOfInvalidEmails.forEach((email: string) => {
    it(`should return false for invalid email of [${email}]`, async () => {
      const result = isValidEmail(email);

      expect(result).toBeFalsy();
    });
  })
});