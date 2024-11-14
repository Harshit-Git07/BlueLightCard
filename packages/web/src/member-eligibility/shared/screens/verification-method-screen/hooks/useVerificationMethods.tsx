import { ReactNode, useCallback, useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useVerificationDescriptions } from './useVerificationDescriptions';

interface VerificationMethod {
  title: string;
  description: string;
  tag?: ReactNode;
  onClick: () => void;
}

export function useVerificationMethods(
  eligibilityDetailsState: EligibilityDetailsState
): VerificationMethod[] {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const { getDescriptionByTitle } = useVerificationDescriptions();

  const handleWorkEmailVerification = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Work Email Verification Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  const handleFileUploadVerification = useCallback(
    (verificationType: string) => {
      // TODO: This is just a hack to get the multi-id to work in regards to fuzzy frontend
      if (eligibilityDetails.requireMultipleIds) {
        setEligibilityDetails({
          ...eligibilityDetails,
          currentScreen: 'File Upload Verification Screen',
          fileVerificationType: [verificationType, 'Fuzzy Frontend Second method'],
        });
        return;
      }

      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'File Upload Verification Screen',
        fileVerificationType: verificationType,
      });
    },
    [eligibilityDetails, setEligibilityDetails]
  );

  return useMemo(() => {
    const methodTitles = ['Work Email', 'NHS Smart Card', 'Payslip', 'Work ID Card'];

    return methodTitles.map((title) => {
      const description = getDescriptionByTitle(title);
      return {
        ...description,
        onClick:
          title === 'Work Email'
            ? handleWorkEmailVerification
            : () => handleFileUploadVerification(title),
      };
    });
  }, [getDescriptionByTitle, handleWorkEmailVerification, handleFileUploadVerification]);
}
