import { Meta, StoryFn } from '@storybook/react';
import { EmploymentStatusScreen } from './EmploymentStatusScreen';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof EmploymentStatusScreen> = {
  title: 'Pages/Signup Eligibility Flow/Employment Status Screen',
  component: EmploymentStatusScreen,
};

const ScreenTemplate: StoryFn<typeof EmploymentStatusScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <EmploymentStatusScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
