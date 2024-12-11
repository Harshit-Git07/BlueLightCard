import { PersonalDetailsFormState } from './usePersonalDetailsState';
import { MemberProfile } from '../../../api/types';
import moment from 'moment';

type Validator<K extends keyof PersonalDetailsFormState> = (
  value: PersonalDetailsFormState[K]['value'],
) => boolean;

export const useFormValidation = (
  formState: PersonalDetailsFormState,
  customerProfile: MemberProfile | null,
) => {
  const formElementValidators: { [K in keyof PersonalDetailsFormState]: Validator<K> } = {
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

  const formElementMatchesUserDefault = <K extends keyof PersonalDetailsFormState>(
    formStateKey: K,
  ): boolean => {
    const formStateValue = formState[formStateKey];
    return formElementValidators[formStateKey](formStateValue.value);
  };

  const changedFromUserDefaults = customerProfile
    ? Object.keys(formState)
        .map((formStateKey) =>
          formElementMatchesUserDefault(formStateKey as keyof PersonalDetailsFormState),
        )
        .some((elementMatches) => !elementMatches)
    : false;

  return {
    changedFromUserDefaults,
    formElementMatchesUserDefault,
  };
};
