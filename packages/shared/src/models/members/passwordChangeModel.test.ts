import { isValidPasswordForAuth0 } from './passwordChangeModel';

describe('auth0PasswordValidator', () => {
  describe('on is valid password for auth 0', () => {
    describe('and password is not valid', () => {
      const listOfInvalidPasswords = [
        'AqW#4V1xY', // too short
        'l0wercase123', // doesn't include uppercase or special characters
        'bUUU3c$fd.t', // more than 2 identical characters in a row
        'MxT£wqZ8!lmi', // includes a special character that is not allowed
        'H🎈ppyD@ys4U', // includes a special character that is not allowed
        'PT!B&$,NKN *TBWE', // doesn't include lowercase or numbers
      ];

      listOfInvalidPasswords.forEach((password: string) => {
        it(`should return false for password [${password}]`, async () => {
          const result = isValidPasswordForAuth0(password);

          expect(result).toBeFalsy();
        });
      });
    });

    describe('and password is valid', () => {
      const listOfValidPasswords = [
        'G7hK9jLw3z2V8mXrG7hK9jLw3z2V8mXr',
        'z!8ulg0f#kmi',
        'T@9VBSK CQXYC',
        'G!rL6YzV3#pQ2',
        'Wm2$gR8cL!nZp1sz',
        'rePPetitionP1',
      ];

      listOfValidPasswords.forEach((password: string) => {
        it(`should return true for password [${password}]`, async () => {
          const result = isValidPasswordForAuth0(password);

          expect(result).toBeTruthy();
        });
      });
    });
  });
});
