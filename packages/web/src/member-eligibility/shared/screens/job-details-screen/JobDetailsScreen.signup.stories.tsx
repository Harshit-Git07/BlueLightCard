import { Meta, StoryFn } from '@storybook/react';
import { JobDetailsScreen } from './JobDetailsScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof JobDetailsScreen> = {
  title: 'Pages/Signup Eligibility Flow/Job Details Screen',
  component: JobDetailsScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof JobDetailsScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Job Details Screen',
    employmentStatus: 'Employed',
  });

  return <JobDetailsScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
