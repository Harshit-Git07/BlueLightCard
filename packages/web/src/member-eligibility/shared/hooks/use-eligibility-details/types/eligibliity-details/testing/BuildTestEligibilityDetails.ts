import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function buildTestEligibilityDetails({
  flow = 'Sign Up',
  currentScreen = 'Interstitial Screen',
  ...props
}: Partial<EligibilityDetails> = {}) {
  return {
    flow,
    currentScreen,
    ...props,
  };
}
