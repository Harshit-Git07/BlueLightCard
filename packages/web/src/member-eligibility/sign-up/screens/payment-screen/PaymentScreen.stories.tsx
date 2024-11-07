import { Meta, StoryFn } from '@storybook/react';
import { PaymentScreen } from './PaymentScreen';
import { noop } from 'lodash';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof PaymentScreen> = {
  title: 'Pages/Signup Eligibility Flow/Payment Screen',
  component: PaymentScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof PaymentScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <PaymentScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
