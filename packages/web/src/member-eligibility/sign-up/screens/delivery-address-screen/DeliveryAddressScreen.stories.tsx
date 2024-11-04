import { Meta, StoryFn } from '@storybook/react';
import { DeliveryAddressScreen } from './DeliveryAddressScreen';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof DeliveryAddressScreen> = {
  title: 'Pages/Signup Eligibility Flow/Delivery Address Screen',
  component: DeliveryAddressScreen,
};

const ScreenTemplate: StoryFn<typeof DeliveryAddressScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <DeliveryAddressScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
