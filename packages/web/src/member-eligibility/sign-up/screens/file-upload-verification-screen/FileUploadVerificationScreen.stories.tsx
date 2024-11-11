import { Meta, StoryFn } from '@storybook/react';
import { FileUploadVerificationScreen } from './FileUploadVerificationScreen';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';

const componentMeta: Meta<typeof FileUploadVerificationScreen> = {
  title: 'Pages/Signup Eligibility Flow/File Upload Verification Screen',
  component: FileUploadVerificationScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const SingleIdTemplate: StoryFn<typeof FileUploadVerificationScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails({
    currentScreen: 'File Upload Verification Screen',
    employmentStatus: 'Employed',
    organisation: 'NHS',
    employer: 'Abbey Hospitals',
    jobTitle: 'Nurse',
    fileVerificationType: 'Work Contract',
  });

  return <FileUploadVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};
export const SingleId = SingleIdTemplate.bind({});

const MultiIdTemplate: StoryFn<typeof FileUploadVerificationScreen> = () => {
  const eligibilityDetailsState = useEligibilityDetails({
    currentScreen: 'File Upload Verification Screen',
    employmentStatus: 'Employed',
    organisation: 'NHS',
    employer: 'Abbey Hospitals',
    jobTitle: 'Nurse',
    requireMultipleIds: true,
    fileVerificationType: ['Work Contract', 'Bank Statement'],
  });

  return <FileUploadVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};
export const MultiId = MultiIdTemplate.bind({});

export default componentMeta;
