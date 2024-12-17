import { Meta, StoryFn } from '@storybook/react';
import { FileUploadVerificationScreen } from './FileUploadVerificationScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof FileUploadVerificationScreen> = {
  title: 'Pages/Signup Eligibility Flow/File Upload Verification Screen',
  component: FileUploadVerificationScreen,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const SingleIdTemplate: StoryFn<typeof FileUploadVerificationScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'File Upload Verification Screen',
    employmentStatus: 'Employed',
    organisation: { id: '1', label: 'NHS', requiresJobTitle: true, requiresJobReference: false },
    employer: {
      id: '1',
      label: 'Abbey Hospitals',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    jobTitle: 'Nurse',
    fileVerificationType: 'Work Contract',
  });

  return <FileUploadVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};
export const SingleId = SingleIdTemplate.bind({});

const MultiIdTemplate: StoryFn<typeof FileUploadVerificationScreen> = () => {
  const eligibilityDetailsState = useSignupEligibilityDetails({
    currentScreen: 'File Upload Verification Screen',
    employmentStatus: 'Employed',
    organisation: { id: '1', label: 'NHS', requiresJobTitle: true, requiresJobReference: false },
    employer: {
      id: '1',
      label: 'Abbey Hospitals',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
    jobTitle: 'Nurse',
    currentIdRequirementDetails: [
      {
        title: 'Required',
        description: 'An required file method',
        guidelines: 'Take a picture of the thing you want verified',
        type: 'file upload',
        required: true,
      },
      {
        title: 'Optional',
        description: 'An optional file method',
        guidelines: 'Take a picture of this optional thing you want verified',
        type: 'file upload',
        required: true,
      },
    ],
    fileVerificationType: ['Work Contract', 'Bank Statement'],
  });

  return <FileUploadVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};
export const MultiId = MultiIdTemplate.bind({});

export default componentMeta;
