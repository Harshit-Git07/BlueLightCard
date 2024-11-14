import { Meta, StoryFn } from '@storybook/react';
import { PaymentScreen } from './PaymentScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { PaymentScreenFuzzyFrontend } from '@/root/src/member-eligibility/shared/screens/payment-screen/PaymentScreenFuzzyFrontend';

const componentMeta: Meta<typeof PaymentScreen> = {
  title: 'Pages/Signup Eligibility Flow/Payment Screen',
  component: PaymentScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof PaymentScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Payment Screen',
    employmentStatus: 'Employed',
    organisation: 'NHS',
    employer: 'Abbey Hospitals',
    jobTitle: 'Nurse',
    emailVerification: 'test@nhs.com',
    address: {
      line1: 'Charnwood Edge Business Park',
      line2: 'Syston Road',
      city: 'Leicester',
      postcode: 'LE7 4UZ',
    },
  });

  return <PaymentScreenFuzzyFrontend eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
