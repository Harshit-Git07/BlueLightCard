import { Meta, StoryFn } from '@storybook/react';
import { SuccessScreen } from './SuccessScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';
import { EligibilityDetailsWithoutFlow } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof SuccessScreen> = {
  title: 'Pages/Renewal Eligibility Flow/Success Screen',
  component: SuccessScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const initialState: EligibilityDetailsWithoutFlow = {
  ...renewalEligibilityDetailsStub,
  currentScreen: 'Success Screen',
};

const DesktopTemplate: StoryFn<typeof SuccessScreen> = () => {
  const [eligibilityDetails] = useRenewalEligibilityDetails(initialState);

  return <SuccessScreen initialState={eligibilityDetails} />;
};
export const Desktop = DesktopTemplate.bind({});

const MobileTemplate: StoryFn<typeof SuccessScreen> = () => {
  const [eligibilityDetails] = useRenewalEligibilityDetails(initialState);

  return <SuccessScreen initialState={eligibilityDetails} forceMobileView />;
};
export const Mobile = MobileTemplate.bind({});

export default componentMeta;
