import { ReactNode } from 'react';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import Tag from '@bluelightcard/shared-ui/components/Tag';

interface VerificationDescription {
  title: string;
  description: string;
  tag?: ReactNode;
}

export function useVerificationDescriptions() {
  // This is a stub implementation to represent the a CMS call which will return a these descriptions
  const getDescriptionByTitle = (title: string): VerificationDescription => {
    const descriptions: Record<string, VerificationDescription> = {
      'Work Email': {
        title: 'Work Email',
        description: 'We will send you a verification email in the next step',
        tag: <Tag state="Success" infoMessage="Fast" iconLeft={faCircleBolt} />,
      },
      'NHS Smart Card': {
        title: 'NHS Smart Card',
        description: 'Upload a picture of your NHS Smart Card',
      },
      Payslip: {
        title: 'Payslip',
        description: 'Upload a picture of your Payslip',
      },
      'Work ID Card': {
        title: 'Work ID Card',
        description: 'Upload a picture of your work ID card',
      },
    };

    return (
      descriptions[title] ?? {
        title,
        description: 'Verification method description not found',
      }
    );
  };

  return { getDescriptionByTitle };
}
