import { Meta, StoryFn } from '@storybook/react';
import { InterstitialScreen } from './InterstitialScreen';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof InterstitialScreen> = {
  title: 'Pages/Signup Eligibility Flow/Interstitial Screen',
  component: InterstitialScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof InterstitialScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <InterstitialScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
