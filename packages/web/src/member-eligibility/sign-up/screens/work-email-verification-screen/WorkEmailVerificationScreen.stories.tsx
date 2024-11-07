import { Meta, StoryFn } from '@storybook/react';
import { WorkEmailVerificationScreen } from './WorkEmailVerificationScreen';
import { noop } from 'lodash';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof WorkEmailVerificationScreen> = {
  title: 'Pages/Signup Eligibility Flow/Work Email Verification Screen',
  component: WorkEmailVerificationScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof WorkEmailVerificationScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <WorkEmailVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
