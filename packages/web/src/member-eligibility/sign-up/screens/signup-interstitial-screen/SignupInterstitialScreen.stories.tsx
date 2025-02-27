import { Meta, StoryFn } from '@storybook/react';
import { SignupInterstitialScreen } from './SignupInterstitialScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof SignupInterstitialScreen> = {
  title: 'Pages/Signup Eligibility Flow/Interstitial Screen',
  component: SignupInterstitialScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof SignupInterstitialScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Interstitial Screen',
  });

  return <SignupInterstitialScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
