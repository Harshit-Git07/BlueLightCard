import { useEffect, useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { useMemberProfilePut } from './useMemberProfilePut';
import { UpdateCustomerProfilePayload } from '../types';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import { ProfileSchema } from '../../CardVerificationAlerts/types';
import moment from 'moment';
import { useGetEmployers } from '../../../hooks/useGetEmployers';
import { getFieldNameFromKey } from '../constants';

type FormItemState<T> = {
  value: T;
  error?: string | undefined;
  disabled?: boolean;
};

type FormItemTypes = {
  dateOfBirth: Date;
  gender: ProfileSchema['gender'];
  phoneNumber: string;
  region: string;
  divisionId: string;
};

export type PersonalInfoFormState = {
  [K in keyof FormItemTypes]: FormItemState<FormItemTypes[K]>;
};

export const defaultFormState: PersonalInfoFormState = {
  dateOfBirth: { value: new Date('01 01 2000'), disabled: false },
  gender: { value: undefined, disabled: false },
  phoneNumber: { value: '', disabled: false },
  region: { value: '', disabled: false },
  divisionId: { value: '', disabled: false },
};

export const usePersonalInfoState = () => {
  const [formState, setFormState] = useState<PersonalInfoFormState>(defaultFormState);

  const { isLoading: isLoadingMemberProfile, memberProfile } = useMemberProfileGet();
  const { isLoading: isLoadingEmployerDetails, data: employerDetails } = useGetEmployers(
    memberProfile?.organisationId,
  );
  const { isPending: isSavingMemberProfile, mutateAsync } = useMemberProfilePut();
  const { changedFromUserDefaults, validateField, formHasInvalidFields } = useFormValidation(
    formState,
    memberProfile,
  );

  const setDisabled = (formItem: keyof PersonalInfoFormState) => {
    setFormState((oldState) => ({
      ...oldState,
      [formItem]: { ...oldState[formItem], disabled: true },
    }));
  };

  const updateFormValue = <K extends keyof PersonalInfoFormState>(
    formItemToUpdate: K,
    newValue?: PersonalInfoFormState[K]['value'],
  ) => {
    // Sets the error based on the new value and updates the form state with value and error (if any).
    const error = validateField(formItemToUpdate, newValue)
      ? undefined
      : `Please enter a valid ${getFieldNameFromKey(formItemToUpdate)}.`;
    const fieldState = { value: newValue, error: error };
    setFormState((oldState) => ({
      ...oldState,
      [formItemToUpdate]: fieldState,
    }));
  };

  const setAllFormValues = <V, K extends keyof FormItemState<V>>(
    propertyToSet: K,
    newValue?: FormItemState<V>[K],
  ) => {
    setFormState((oldState) => {
      const mappedEntries = Object.entries(oldState).map(([formItemKey, formItem]) => [
        formItemKey,
        {
          ...formItem,
          [propertyToSet]: newValue,
        },
      ]);
      return Object.fromEntries(mappedEntries);
    });
  };

  const mapFormBodyToPUTPayload = (): UpdateCustomerProfilePayload | undefined => {
    if (!memberProfile) return;

    const newGender = formState.gender.value;
    const newDateOfBirth = formState.dateOfBirth.value
      ? moment(formState.dateOfBirth.value).format('YYYY-MM-DD')
      : '';
    const newPhoneNumber = formState.phoneNumber.value;
    const newCounty = formState.region.value;
    const newEmployerId = formState.divisionId.value;

    const postBody: UpdateCustomerProfilePayload = {
      ...memberProfile,
    };
    if (newGender && newGender !== memberProfile.gender) {
      postBody.gender = newGender;
    }

    if (newDateOfBirth && newDateOfBirth !== memberProfile.dateOfBirth) {
      postBody.dateOfBirth = newDateOfBirth;
    }

    if (newPhoneNumber && newPhoneNumber !== memberProfile.phoneNumber) {
      postBody.phoneNumber = newPhoneNumber;
    }

    if (newCounty && newCounty !== memberProfile.county) {
      postBody.county = newCounty;
    }

    if (newEmployerId && newEmployerId !== memberProfile.employerName) {
      postBody.employerId = newEmployerId;
      postBody.employerName = employerDetails?.find(
        (employer) => employer.employerId === newEmployerId,
      )?.name;
    }

    return postBody;
  };

  const makeApiRequest = async () => {
    const postBody = mapFormBodyToPUTPayload();

    if (postBody) {
      return mutateAsync(postBody);
    }
  };

  useEffect(() => {
    setAllFormValues('disabled', isLoadingMemberProfile);

    if (isLoadingEmployerDetails) {
      setDisabled('divisionId');
    }

    if (memberProfile) {
      updateFormValue('dateOfBirth', new Date(memberProfile.dateOfBirth));
      updateFormValue('gender', memberProfile.gender);
      updateFormValue('phoneNumber', memberProfile.phoneNumber);
      updateFormValue('region', memberProfile.county);
      updateFormValue('divisionId', memberProfile.employerId);
    }
  }, [isLoadingMemberProfile, memberProfile]);

  return {
    formState,
    saveButtonDisabled: isSavingMemberProfile || !changedFromUserDefaults || formHasInvalidFields,
    updateFormValue,
    makeApiRequest,
  };
};
