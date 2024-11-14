import { Meta, StoryFn } from '@storybook/react';
import { SuccessScreen } from './SuccessScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';

const componentMeta: Meta<typeof SuccessScreen> = {
  title: 'Pages/Signup Eligibility Flow/Success Screen',
  component: SuccessScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const ScreenTemplate: StoryFn<typeof SuccessScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'Success Screen',
    employmentStatus: 'Employed',
    organisation: 'NHS',
    employer: 'Abbey Hospitals',
    jobTitle: 'Nurse',
    emailVerification: 'test@nhs.com',
    address: {
      line1: 'Charnwood Edge Business Park',
      line2: 'Syston Road',
      city: 'Leicester',
      postcode: 'LE7 4UZ',
    },
  });

  return <SuccessScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
