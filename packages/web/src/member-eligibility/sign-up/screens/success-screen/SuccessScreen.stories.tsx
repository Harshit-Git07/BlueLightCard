import { Meta, StoryFn } from '@storybook/react';
import { SuccessScreen } from './SuccessScreen';
import { noop } from 'lodash';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof SuccessScreen> = {
  title: 'Pages/Signup Eligibility Flow/Success Screen',
  component: SuccessScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof SuccessScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <SuccessScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
