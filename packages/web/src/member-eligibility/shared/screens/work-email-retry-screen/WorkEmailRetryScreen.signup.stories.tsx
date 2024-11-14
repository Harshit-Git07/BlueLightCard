import { Meta, StoryFn } from '@storybook/react';
import { WorkEmailRetryScreen } from './WorkEmailRetryScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';

const componentMeta: Meta<typeof WorkEmailRetryScreen> = {
  title: 'Pages/Signup Eligibility Flow/Work Email Retry Screen',
  component: WorkEmailRetryScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof WorkEmailRetryScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Work Email Retry Screen',
    employmentStatus: 'Employed',
    organisation: 'NHS',
    employer: 'Abbey Hospitals',
    jobTitle: 'Nurse',
  });

  return <WorkEmailRetryScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
