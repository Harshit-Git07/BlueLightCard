export function isValidPasswordForCognito(password: string): boolean {
  // (?!\s+) Disallows leading spaces.
  // (?!.*\s+$) Disallows trailing spaces.
  // (?=.*[a-z]) Requires lowercase letters.
  // (?=.*[A-Z]) Requires uppercase letters.
  // (?=.*[0-9]) Requires numbers.
  // (?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]) Requires at least one special character from the specified set. (The non-leading, non-trailing space character is also treated as a special character.)
  // [A-Za-z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{6,256} Minimum 6 characters from the allowed set, maximum 256 characters.
  const cognitoPasswordRegex = new RegExp("^(?!\\s+)(?!.*\\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\\]{}()?\"!@#%&/\\\\,><':;|_~`=+\\- ])[A-Za-z0-9$^*.[\\]{}()?\"!@#%&/\\\\,><':;|_~`=+\\- ]{6,256}$")
  return cognitoPasswordRegex.test(password)
}

export function isValidPasswordForLegacy(password: string): boolean {
  // This regex is taken from the legacy repos - all 3 brands use this same basic regex
  const legacyPasswordRegex = new RegExp("^[A-Za-z0-9{}\\-?_~!@#$%^&*().\\[\\]`;:\\/|+,=]+$");
  return legacyPasswordRegex.test(password)
}