import { Meta, StoryFn } from '@storybook/react';
import { RenewalAccountDetailsScreen } from './RenewalAccountDetailsScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

const componentMeta: Meta<typeof RenewalAccountDetailsScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Renewal Account Details Screen',
  component: RenewalAccountDetailsScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof RenewalAccountDetailsScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Renewal Account Details Screen',
  });

  return <RenewalAccountDetailsScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
