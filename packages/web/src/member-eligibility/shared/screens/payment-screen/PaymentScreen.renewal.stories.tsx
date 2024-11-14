import { Meta, StoryFn } from '@storybook/react';
import { PaymentScreen } from './PaymentScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';
import { PaymentScreenFuzzyFrontend } from '@/root/src/member-eligibility/shared/screens/payment-screen/PaymentScreenFuzzyFrontend';

const componentMeta: Meta<typeof PaymentScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Payment Screen',
  component: PaymentScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof PaymentScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Payment Screen',
  });

  return <PaymentScreenFuzzyFrontend eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
