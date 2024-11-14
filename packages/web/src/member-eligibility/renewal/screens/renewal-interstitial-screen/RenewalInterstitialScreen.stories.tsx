import { Meta, StoryFn } from '@storybook/react';
import { RenewalInterstitialScreen } from './RenewalInterstitialScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

const componentMeta: Meta<typeof RenewalInterstitialScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Renewal Interstitial Screen',
  component: RenewalInterstitialScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof RenewalInterstitialScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Interstitial Screen',
  });

  return <RenewalInterstitialScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
