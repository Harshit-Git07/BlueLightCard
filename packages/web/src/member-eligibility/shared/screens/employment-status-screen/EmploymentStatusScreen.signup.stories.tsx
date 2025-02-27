import { Meta, StoryFn } from '@storybook/react';
import { EmploymentStatusScreen } from './EmploymentStatusScreen';
import {
  eligibilityDetailsStub,
  useSignupEligibilityDetails,
} from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof EmploymentStatusScreen> = {
  title: 'Pages/Signup Eligibility Flow/Employment Status Screen',
  component: EmploymentStatusScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof EmploymentStatusScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    ...eligibilityDetailsStub,
    currentScreen: 'Employment Status Screen',
  });

  return <EmploymentStatusScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
