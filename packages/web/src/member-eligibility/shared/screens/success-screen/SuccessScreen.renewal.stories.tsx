import { Meta, StoryFn } from '@storybook/react';
import { SuccessScreen } from './SuccessScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

const componentMeta: Meta<typeof SuccessScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Success Screen',
  component: SuccessScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof SuccessScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Success Screen',
  });

  return <SuccessScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
