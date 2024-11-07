import { Meta, StoryFn } from '@storybook/react';
import { WorkEmailRetryScreen } from './WorkEmailRetryScreen';
import { noop } from 'lodash';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof WorkEmailRetryScreen> = {
  title: 'Pages/Signup Eligibility Flow/Work Email Retry Screen',
  component: WorkEmailRetryScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof WorkEmailRetryScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <WorkEmailRetryScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
