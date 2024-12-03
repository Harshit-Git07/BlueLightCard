import { renderHook, act } from '@testing-library/react';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/hooks/FuzzyFrontendButtons';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { Dispatch } from 'react';

describe('useFuzzyFrontendButtons', () => {
  describe('given sign up flow', () => {
    it('should navigate to Job Details Screen', () => {
      const eligibilityDetails: EligibilityDetails = {
        flow: 'Sign Up',
        currentScreen: 'Verification Method Screen',
      } as const;
      const setEligibilityDetails: Dispatch<EligibilityDetails> = jest.fn();
      const { result } = renderHook(() =>
        useFuzzyFrontendButtons([eligibilityDetails, setEligibilityDetails])
      );

      act(() => {
        result.current[0].onClick();
      });

      expect(setEligibilityDetails).toHaveBeenCalledWith({
        ...eligibilityDetails,
        currentScreen: 'Job Details Screen',
      });
    });
  });

  it('should return button with correct text', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Verification Method Screen',
    } as const;
    const setEligibilityDetails: Dispatch<EligibilityDetails> = jest.fn();
    const { result } = renderHook(() =>
      useFuzzyFrontendButtons([eligibilityDetails, setEligibilityDetails])
    );

    expect(result.current[0].text).toBe('Back');
  });
});
