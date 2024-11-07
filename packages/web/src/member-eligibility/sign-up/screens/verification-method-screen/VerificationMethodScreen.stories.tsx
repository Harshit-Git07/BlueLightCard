import { Meta, StoryFn } from '@storybook/react';
import { VerificationMethodScreen } from './VerificationMethodScreen';
import { noop } from 'lodash';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof VerificationMethodScreen> = {
  title: 'Pages/Signup Eligibility Flow/Verification Method Screen',
  component: VerificationMethodScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof VerificationMethodScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <VerificationMethodScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
