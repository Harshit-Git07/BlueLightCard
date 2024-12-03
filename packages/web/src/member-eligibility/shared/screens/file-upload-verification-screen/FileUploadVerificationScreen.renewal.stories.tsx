import { Meta, StoryFn } from '@storybook/react';
import { FileUploadVerificationScreen } from './FileUploadVerificationScreen';
import {
  renewalEligibilityDetailsStub,
  useRenewalEligibilityDetails,
} from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof FileUploadVerificationScreen> = {
  title: 'Pages/Renewal Eligibility Flow/File Upload Verification Screen',
  decorators: [StorybookPlatformAdapterDecorator],
  component: FileUploadVerificationScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const SingleIdTemplate: StoryFn<typeof FileUploadVerificationScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'File Upload Verification Screen',
    fileVerificationType: 'Work Contract',
  });

  return <FileUploadVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};
export const SingleId = SingleIdTemplate.bind({});

const MultiIdTemplate: StoryFn<typeof FileUploadVerificationScreen> = () => {
  const eligibilityDetailsState = useRenewalEligibilityDetails({
    ...renewalEligibilityDetailsStub,
    currentScreen: 'File Upload Verification Screen',
    requireMultipleIds: true,
    fileVerificationType: ['Work Contract', 'Bank Statement'],
  });

  return <FileUploadVerificationScreen eligibilityDetailsState={eligibilityDetailsState} />;
};
export const MultiId = MultiIdTemplate.bind({});

export default componentMeta;
