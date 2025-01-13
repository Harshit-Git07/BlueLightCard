import { renderHook } from '@testing-library/react';
import { useFormValidation } from './useFormValidation';
import { defaultFormState } from './usePersonalInfoState';
import { MemberProfile } from '@/api/types';
import { customerProfileNoCardMock } from '@/components/PersonalInformation/mocks/customerProfile';

describe('useFormValidation', () => {
  it('validates form changes when no customer profile', () => {
    const { result } = renderHook(() => useFormValidation(defaultFormState, null));

    expect(result.current.changedFromUserDefaults).toBeFalsy();
  });

  it('validates form changes when matching customer profile', () => {
    const matchingCustomerProfile: MemberProfile = {
      ...customerProfileNoCardMock,
      dateOfBirth: defaultFormState.dateOfBirth.value.toLocaleDateString(),
      gender: defaultFormState.gender.value,
      phoneNumber: defaultFormState.phoneNumber.value,
      county: defaultFormState.region.value,
      employerId: defaultFormState.divisionId.value,
    };
    const { result } = renderHook(() =>
      useFormValidation(defaultFormState, matchingCustomerProfile),
    );

    expect(result.current.changedFromUserDefaults).toBeFalsy();
  });

  it('validates form changes when not matching customer profile', () => {
    const { result } = renderHook(() =>
      useFormValidation(defaultFormState, customerProfileNoCardMock),
    );

    expect(result.current.changedFromUserDefaults).toBeTruthy();
  });
});
