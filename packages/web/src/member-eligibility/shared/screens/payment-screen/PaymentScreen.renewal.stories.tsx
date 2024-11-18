import { Meta, StoryFn } from '@storybook/react';
import { PaymentScreen } from './PaymentScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof PaymentScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Payment Screen',
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
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Payment Screen',
  });

  return <PaymentScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
