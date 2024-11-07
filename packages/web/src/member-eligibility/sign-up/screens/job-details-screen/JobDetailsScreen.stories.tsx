import { Meta, StoryFn } from '@storybook/react';
import { JobDetailsScreen } from './JobDetailsScreen';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof JobDetailsScreen> = {
  title: 'Pages/Signup Eligibility Flow/Job Details Screen',
  component: JobDetailsScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof JobDetailsScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <JobDetailsScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
