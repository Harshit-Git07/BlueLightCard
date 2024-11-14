import { Meta, StoryFn } from '@storybook/react';
import { WorkEmailVerificationScreen } from './WorkEmailVerificationScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

const componentMeta: Meta<typeof WorkEmailVerificationScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Work Email Verification Screen',
  component: WorkEmailVerificationScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof WorkEmailVerificationScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Work Email Verification Screen',
  });

  return <WorkEmailVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
