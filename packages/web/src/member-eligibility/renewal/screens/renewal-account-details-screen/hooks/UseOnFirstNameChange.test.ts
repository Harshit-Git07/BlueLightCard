import { renderHook } from '@testing-library/react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { useOnFirstNameChange } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseOnFirstNameChange';
import { ChangeEvent } from 'react';

describe('Given the member enters a first name', () => {
  const mockSetEligibilityDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update firstName while preserving other member details', () => {
    const initialState: EligibilityDetails = {
      currentScreen: 'Renewal Account Details Screen',
      flow: 'Renewal',
      member: {
        firstName: 'John',
        surname: 'Doe',
        dob: new Date('1990-01-01'),
      },
    };

    const { result } = renderHook(() =>
      useOnFirstNameChange([initialState, mockSetEligibilityDetails])
    );

    const event = {
      target: { value: 'Jane' },
    } as ChangeEvent<HTMLInputElement>;

    result.current(event);

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      currentScreen: 'Renewal Account Details Screen',
      flow: 'Renewal',
      member: {
        firstName: 'Jane',
        surname: 'Doe',
        dob: expect.any(Date),
      },
    });
  });

  it('should handle empty initial member state', () => {
    const initialState: EligibilityDetails = {
      currentScreen: 'Renewal Account Details Screen',
      flow: 'Renewal',
      member: undefined,
    };

    const { result } = renderHook(() =>
      useOnFirstNameChange([initialState, mockSetEligibilityDetails])
    );

    const event = {
      target: { value: 'Jane' },
    } as ChangeEvent<HTMLInputElement>;

    result.current(event);

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      currentScreen: 'Renewal Account Details Screen',
      flow: 'Renewal',
      member: {
        firstName: 'Jane',
        surname: '',
        dob: expect.any(Date),
      },
    });
  });
});
