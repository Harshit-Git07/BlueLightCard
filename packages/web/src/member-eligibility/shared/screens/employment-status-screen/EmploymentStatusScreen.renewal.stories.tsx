import { Meta, StoryFn } from '@storybook/react';
import { EmploymentStatusScreen } from './EmploymentStatusScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

const componentMeta: Meta<typeof EmploymentStatusScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Employment Status Screen',
  component: EmploymentStatusScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof EmploymentStatusScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'Employment Status Screen',
  });

  return <EmploymentStatusScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
