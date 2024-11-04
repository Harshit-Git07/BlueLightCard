import { Meta, StoryFn } from '@storybook/react';
import { FileUploadVerificationScreen } from './FileUploadVerificationScreen';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof FileUploadVerificationScreen> = {
  title: 'Pages/Signup Eligibility Flow/File Upload Verification Screen',
  component: FileUploadVerificationScreen,
};

const ScreenTemplate: StoryFn<typeof FileUploadVerificationScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails();

  return <FileUploadVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};

export const Screen = ScreenTemplate.bind({});

export default componentMeta;
