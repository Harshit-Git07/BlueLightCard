import { Meta, StoryFn } from '@storybook/react';
import { VerificationMethodScreen } from './VerificationMethodScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

const componentMeta: Meta<typeof VerificationMethodScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Verification Method Screen',
  component: VerificationMethodScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof VerificationMethodScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Verification Method Screen',
  });

  return <VerificationMethodScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
