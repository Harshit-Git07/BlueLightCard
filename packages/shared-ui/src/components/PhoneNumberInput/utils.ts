import { defaultCountries } from 'react-international-phone';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const countriesByDialCode = new Map();
defaultCountries.forEach((countryData) => {
  const dialCode = countryData[2];
  // exclude vatican city
  if (dialCode === '39' && countryData[1] === 'va') return;
  countriesByDialCode.set(dialCode, {
    name: countryData[0],
    iso2: countryData[1],
    dialCode,
    format: countryData[3],
    priority: countryData[4],
    areaCodes: countryData[5],
  });
});

export const calculateDialCodeWidth = (dialCode: string) => {
  const baseWidth = 25;
  const extraWidthPerChar = 10;
  const dialCodeLength = dialCode.length;

  return `${baseWidth + (dialCodeLength - 2) * extraWidthPerChar}px`;
};

export const validatePhoneNumber = (dialCode = '', phoneNumber = ''): string | null => {
  const fullPhoneNumber = `+${dialCode}${phoneNumber}`;
  const emptyErrorMessage = 'Please enter a phone number';
  const invalidErrorMessage = 'Please enter a valid phone number';
  if (!phoneNumber || !fullPhoneNumber) {
    return emptyErrorMessage;
  }

  const parsedNumber = parsePhoneNumberFromString(fullPhoneNumber);

  if (!parsedNumber?.isValid()) {
    return invalidErrorMessage;
  }

  return null;
};
