import { Meta, StoryFn } from '@storybook/react';
import { VerificationMethodScreen } from './VerificationMethodScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';

const componentMeta: Meta<typeof VerificationMethodScreen> = {
  title: 'Pages/Signup Eligibility Flow/Verification Method Screen',
  component: VerificationMethodScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof VerificationMethodScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Verification Method Screen',
    employmentStatus: 'Employed',
    organisation: 'NHS',
    employer: 'Abbey Hospitals',
    jobTitle: 'Nurse',
  });

  return <VerificationMethodScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
