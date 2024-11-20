import { Meta, StoryFn } from '@storybook/react';
import { WorkEmailVerificationScreen } from './WorkEmailVerificationScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';

const componentMeta: Meta<typeof WorkEmailVerificationScreen> = {
  title: 'Pages/Signup Eligibility Flow/Work Email Verification Screen',
  component: WorkEmailVerificationScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof WorkEmailVerificationScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Work Email Verification Screen',
    employmentStatus: 'Employed',
    organisation: { id: '1', label: 'NHS' },
    employer: { id: '1', label: 'Abbey Hospitals' },
    jobTitle: 'Nurse',
  });

  return <WorkEmailVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
