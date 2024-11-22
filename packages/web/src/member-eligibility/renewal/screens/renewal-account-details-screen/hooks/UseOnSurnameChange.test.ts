import { renderHook } from '@testing-library/react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import { useOnSurnameChange } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseOnSurnameChange';
import { ChangeEvent } from 'react';

describe('Given the member enters a surname', () => {
  const mockSetEligibilityDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update surname while preserving other member details', () => {
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
      useOnSurnameChange([initialState, mockSetEligibilityDetails])
    );

    const event = {
      target: { value: 'Smith' },
    } as ChangeEvent<HTMLInputElement>;

    result.current(event);

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      currentScreen: 'Renewal Account Details Screen',
      flow: 'Renewal',
      member: {
        firstName: 'John',
        surname: 'Smith',
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
      useOnSurnameChange([initialState, mockSetEligibilityDetails])
    );

    const event = {
      target: { value: 'Smith' },
    } as ChangeEvent<HTMLInputElement>;

    result.current(event);

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      currentScreen: 'Renewal Account Details Screen',
      flow: 'Renewal',
      member: {
        firstName: '',
        surname: 'Smith',
        dob: expect.any(Date),
      },
    });
  });
});
