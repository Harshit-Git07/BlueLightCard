import { Meta, StoryFn } from '@storybook/react';
import { PaymentScreen } from './PaymentScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof PaymentScreen> = {
  title: 'Pages/Signup Eligibility Flow/Payment Screen',
  component: PaymentScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
    platformAdapter: {
      invokeV5Api: async (path: string) => {
        if (!path.includes('/orders/checkout')) return undefined;

        return {
          statusCode: 503,
        };
      },
    },
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

  return <PaymentScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
