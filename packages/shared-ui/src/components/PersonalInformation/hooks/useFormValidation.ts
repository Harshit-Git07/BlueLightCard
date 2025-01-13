import { PersonalInfoFormState } from './usePersonalInfoState';
import { MemberProfile } from '../../../api/types';
import moment from 'moment';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

type Validator<K extends keyof PersonalInfoFormState> = (
  value: PersonalInfoFormState[K]['value'],
) => boolean;

export const useFormValidation = (
  formState: PersonalInfoFormState,
  customerProfile: MemberProfile | null,
) => {
  const formElementValidators: { [K in keyof PersonalInfoFormState]: Validator<K> } = {
    dateOfBirth: (value) => {
      const formMoment = moment(value);
      const customerMoment = moment(customerProfile?.dateOfBirth);
      return formMoment.isSame(customerMoment);
    },
    gender: (value) => customerProfile?.gender === value,
    phoneNumber: (value) => customerProfile?.phoneNumber === value,
    region: (value) => customerProfile?.county === value,
    divisionId: (value) => customerProfile?.employerId === value,
  };

  const formFieldMatchesUserDefault = <K extends keyof PersonalInfoFormState>(
    formStateKey: K,
  ): boolean => {
    const formStateValue = formState[formStateKey];
    return formElementValidators[formStateKey](formStateValue.value);
  };

  const changedFromUserDefaults = customerProfile
    ? Object.keys(formState)
        .map((formStateKey) =>
          formFieldMatchesUserDefault(formStateKey as keyof PersonalInfoFormState),
        )
        .some((elementMatches) => !elementMatches)
    : false;

  const isDateOfBirthValid = (value: Date) => moment(value).isValid();

  const isPhoneNumberValid = (value: string) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(value));
    } catch (e) {
      return false;
    }
  };

  const validateField = <K extends keyof PersonalInfoFormState>(
    formField: K,
    newValue?: PersonalInfoFormState[K]['value'],
  ) => {
    switch (formField) {
      case 'dateOfBirth':
        return !!newValue && isDateOfBirthValid(newValue as Date);
      case 'phoneNumber':
        return isPhoneNumberValid(newValue as string);
      default:
        return true;
    }
  };

  const formHasInvalidFields = Object.values(formState).some((field) => !!field.error);

  return {
    changedFromUserDefaults,
    validateField,
    formHasInvalidFields,
  };
};
