import { useEffect, useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { useGetEmployers } from '../../../hooks/useGetEmployers';
import { useMemberProfilePut } from './useMemberProfilePut';
import { UpdateCustomerProfilePayload } from '../types';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import { ProfileSchema } from '../../CardVerificationAlerts/types';
import useMemberId from '../../../hooks/useMemberId';
import moment from 'moment';

type FormItemState<T> = {
  value: T;
  error?: string;
  disabled?: boolean;
};

type FormItemTypes = {
  dateOfBirth: Date;
  gender: ProfileSchema['gender'];
  phoneNumber: string;
  region: string;
  divisionId: string;
};

export type PersonalDetailsFormState = {
  [K in keyof FormItemTypes]: FormItemState<FormItemTypes[K]>;
};

export const defaultFormState: PersonalDetailsFormState = {
  dateOfBirth: { value: new Date('01 01 2000'), disabled: false },
  gender: { value: undefined, disabled: false },
  phoneNumber: { value: '', disabled: false },
  region: { value: '', disabled: false },
  divisionId: { value: '', disabled: false },
};

export const usePersonalDetailsState = () => {
  const [formState, setFormState] = useState<PersonalDetailsFormState>(defaultFormState);
  const memberId = useMemberId();
  const { isLoading: isLoadingPersonalDetails, memberProfile } = useMemberProfileGet(memberId);
  const { isLoading: isLoadingEmployerDetails, data: employerDetails } = useGetEmployers(
    memberProfile?.organisationId,
  );
  const { isPending: isSavingPersonalDetails, mutateAsync } = useMemberProfilePut(memberId);
  const { changedFromUserDefaults } = useFormValidation(formState, memberProfile);

  const setDisabled = (formItem: keyof PersonalDetailsFormState) => {
    setFormState((oldState) => ({
      ...oldState,
      [formItem]: { ...oldState[formItem], disabled: true },
    }));
  };

  const setError = (formItem: keyof PersonalDetailsFormState, error: string) => {
    setFormState((oldState) => ({
      ...oldState,
      [formItem]: { ...oldState[formItem], error },
    }));
  };

  const updateFormValue = <K extends keyof PersonalDetailsFormState>(
    formItemToUpdate: K,
    newValue?: PersonalDetailsFormState[K]['value'],
  ) => {
    if (newValue) {
      setFormState((oldState) => ({
        ...oldState,
        [formItemToUpdate]: { value: newValue },
      }));
    }
  };

  const setAllFormValues = <V, K extends keyof FormItemState<V>>(
    propertyToSet: K,
    newValue: FormItemState<V>[K],
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
    setAllFormValues('disabled', isLoadingPersonalDetails);

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
  }, [isLoadingPersonalDetails, memberProfile]);

  return {
    formState,
    saveButtonDisabled: isSavingPersonalDetails || !changedFromUserDefaults,
    updateFormValue,
    setError,
    makeApiRequest,
  };
};
