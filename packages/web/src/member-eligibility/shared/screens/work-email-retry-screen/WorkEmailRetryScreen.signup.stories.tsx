import { Meta, StoryFn } from '@storybook/react';
import { WorkEmailRetryScreen } from './WorkEmailRetryScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof WorkEmailRetryScreen> = {
  title: 'Pages/Signup Eligibility Flow/Work Email Retry Screen',
  component: WorkEmailRetryScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof WorkEmailRetryScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Work Email Retry Screen',
    employmentStatus: 'Employed',
    organisation: { id: '1', label: 'NHS', requiresJobTitle: true, requiresJobReference: false },
    employer: {
      id: '1',
      label: 'Abbey Hospitals',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    jobTitle: 'Nurse',
  });

  return <WorkEmailRetryScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
