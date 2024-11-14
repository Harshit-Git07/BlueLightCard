import { Meta, StoryFn } from '@storybook/react';
import { WorkEmailRetryScreen } from './WorkEmailRetryScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

const componentMeta: Meta<typeof WorkEmailRetryScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Work Email Retry Screen',
  component: WorkEmailRetryScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof WorkEmailRetryScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Work Email Retry Screen',
  });

  return <WorkEmailRetryScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
