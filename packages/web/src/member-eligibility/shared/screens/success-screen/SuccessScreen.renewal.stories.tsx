import { Meta, StoryFn } from '@storybook/react';
import { SuccessScreen } from './SuccessScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { EligibilityDetailsWithoutFlow } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

const componentMeta: Meta<typeof SuccessScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Success Screen',
  component: SuccessScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const initialState: EligibilityDetailsWithoutFlow = {
  ...renewalEligibilityDetailsStub,
  currentScreen: 'Success Screen',
};

const DesktopTemplate: StoryFn<typeof SuccessScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails(initialState);

  return <SuccessScreen eligibilityDetailsState={eligibilityDetailsState} />;
};
export const Desktop = DesktopTemplate.bind({});

const MobileTemplate: StoryFn<typeof SuccessScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails(initialState);

  return <SuccessScreen eligibilityDetailsState={eligibilityDetailsState} forceMobileView />;
};
export const Mobile = MobileTemplate.bind({});

export default componentMeta;
