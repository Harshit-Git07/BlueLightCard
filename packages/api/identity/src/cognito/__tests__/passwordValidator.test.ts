import { isValidPasswordForCognito, isValidPasswordForLegacy } from "../passwordValidator";

describe('passwordValidator', () => {
  describe('isValidPasswordForCognito', () => {
    const listOfValidCognitoPasswords = [
      'J[6&Xa',
      'u4Cp/ 5*cGNy',
      'FJDSKLJ3423879450328509! 432i905 5 5345j4o9*)&**()%#$()()# gjdfklgjdrkgjeriojgioregjrioejtji45o6j456890tui4jtigjioerjgl4m3gl45gmritgj8954jg5iogvjrdlgfjrelgj4j3890tu34ojigldrijg8904u6j4ilertji89e0gjfidojvklxfjvkldfjvlkjdflgkjlkdjg89453908968u8f9ds7fd8s9ff9d',
      'J[6&gXj$f'
    ];

    const listOfInvalidCognitoPasswords = [
      '!bcd5678',
      '!BCD5678',
      '!bcdEfg*',
      'u4Cp/\t5*cGNy',
      'ZVu_2',
      'FJDSKLJ3423879450328509! 432i905 5 5345j4o9*)&**()%#$()()# gjdfklgjdrkgjeriojgioregjrioejtji45o6j456890tui4jtigjioerjgl4m3gl45gmritgj8954jg5iogvjrdlgfjrelgj4j3890tu34ojigldrijg8904u6j4ilertji89e0gjfidojvklxfjvkldfjvlkjdflgkjlkdjg89453908968u8f9ds7fd8s9ff9dd',
      'Sjgdfk423 ®&',
      ' J[6&gXj$f',
      '  J[6&gXj$f',
      'J[6&gXj$f ',
      'J[6&gXj$f  ',
      'J[6&gXj$f🧀'
    ];

    listOfValidCognitoPasswords.forEach((password: string) => {
      it(`should return true for valid password of [${password}] for Cognito`, async () => {
        const result = isValidPasswordForCognito(password);

        expect(result).toBeTruthy();
      });
    });

    listOfInvalidCognitoPasswords.forEach((password: string) => {
      it(`should return false for invalid password of [${password}] for Cognito`, async () => {
        const result = isValidPasswordForCognito(password);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('isValidPasswordForLegacy', () => {
    const listOfValidLegacyPasswords = [
      'J[6&Xa{',
      '}u4Cp/5*cGNy',
      'FJDSKLJ3423879450328509!432i90555345j4o9*)&**()%#$()()#gjdfklgjdrkgjeriojgioregjrioejtji45o6j456890tui4jtigjioerjgl4m3gl45gmritgj8954jg5iogvjrdlgfjrelgj4j3890tu34ojigldrijg8904u6j4ilertji89e0gjfidojvklxfjvkldfjvlkjdflgkjlkdjg89453908968u8f9ds7fd8s9ff9d',
      'J[6&gXj$f',
      '!bcd5678',
      '!BCD5678',
      '!bcdEfg*',
      'ZVu_2',
    ];

    const listOfInvalidLegacyPasswords = [
      'u4Cp/\t5*cGNy',
      'Sjgdfk423®&',
      ' J[6&gXj$f',
      'J[6&g Xj$f',
      'J[6&gXj$f ',
      'J[6&gXj$f🧀'
    ];

    listOfValidLegacyPasswords.forEach((password: string) => {
      it(`should return true for valid password of [${password}] for Legacy`, async () => {
        const result = isValidPasswordForLegacy(password);

        expect(result).toBeTruthy();
      });
    });

    listOfInvalidLegacyPasswords.forEach((password: string) => {
      it(`should return false for invalid password of [${password}] for Legacy`, async () => {
        const result = isValidPasswordForLegacy(password);

        expect(result).toBeFalsy();
      });
    });
  });
});