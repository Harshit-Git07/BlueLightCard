import { Meta, StoryFn } from '@storybook/react';
import { DeliveryAddressScreen } from './DeliveryAddressScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';

const componentMeta: Meta<typeof DeliveryAddressScreen> = {
  title: 'Pages/Signup Eligibility Flow/Delivery Address Screen',
  component: DeliveryAddressScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof DeliveryAddressScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Delivery Address Screen',
    employmentStatus: 'Employed',
    organisation: { id: '1', label: 'NHS' },
    employer: { id: '1', label: 'Abbey Hospitals' },
    jobTitle: 'Nurse',
    emailVerification: 'test@nhs.com',
  });

  return <DeliveryAddressScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
