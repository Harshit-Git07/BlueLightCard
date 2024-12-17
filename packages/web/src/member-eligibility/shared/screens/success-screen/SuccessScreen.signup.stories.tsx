import { Meta, StoryFn } from '@storybook/react';
import { SuccessScreen } from './SuccessScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { EligibilityDetailsWithoutFlow } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof SuccessScreen> = {
  title: 'Pages/Signup Eligibility Flow/Success Screen',
  component: SuccessScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const initialState: EligibilityDetailsWithoutFlow = {
  currentScreen: 'Success Screen',
  employmentStatus: 'Employed',
  organisation: { id: '1', label: 'NHS', requiresJobTitle: true, requiresJobReference: false },
  employer: {
    id: '1',
    label: 'Abbey Hospitals',
    requiresJobTitle: true,
    requiresJobReference: false,
  },
  jobTitle: 'Nurse',
  emailVerification: 'test@nhs.com',
  address: {
    line1: 'Charnwood Edge Business Park',
    line2: 'Syston Road',
    city: 'Leicester',
    county: 'Down',
    postcode: 'LE7 4UZ',
  },
};

const DesktopTemplate: StoryFn<typeof SuccessScreen> = () => {
  const [eligibilityDetails] = useSignupEligibilityDetails(initialState);

  return <SuccessScreen initialState={eligibilityDetails} />;
};
export const Desktop = DesktopTemplate.bind({});

const MobileTemplate: StoryFn<typeof SuccessScreen> = () => {
  const [eligibilityDetails] = useSignupEligibilityDetails(initialState);

  return <SuccessScreen initialState={eligibilityDetails} forceMobileView />;
};
export const Mobile = MobileTemplate.bind({});

export default componentMeta;
