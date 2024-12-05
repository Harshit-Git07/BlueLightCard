import { renderHook, act } from '@testing-library/react';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/hooks/FuzzyFrontendButtons';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

const eligibilityDetails: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Verification Method Screen',
};
const setEligibilityDetails = jest.fn();

it('should return button with correct text', () => {
  const { result } = renderHook(() =>
    useFuzzyFrontendButtons([eligibilityDetails, setEligibilityDetails])
  );

  expect(result.current[0].text).toBe('Back');
});

it('should navigate to Job Details Screen', () => {
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
