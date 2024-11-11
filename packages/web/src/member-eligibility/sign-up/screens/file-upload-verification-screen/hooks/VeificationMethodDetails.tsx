import { ReactNode, useMemo } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/types/EligibilityDetails';

interface VerificationMethodDetails {
  firstVerificationMethod: VerificationMethodTitleAndDescription;
  secondVerificationMethod?: VerificationMethodTitleAndDescription;
}

interface VerificationMethodTitleAndDescription {
  title: string;
  description?: ReactNode;
}

export function useVerificationMethodDetails(
  eligibilityDetails: EligibilityDetails
): VerificationMethodDetails {
  // TODO: This should come from the service layer, but for now it is stubbed out
  return {
    firstVerificationMethod: useFirstVerificationMethodDetails(eligibilityDetails),
    secondVerificationMethod: useSecondVerificationMethodDetails(eligibilityDetails),
  };
}

function useFirstVerificationMethodDetails(
  eligibilityDetails: EligibilityDetails
): VerificationMethodTitleAndDescription {
  const firstVerificationMethodTitle = useMemo(() => {
    if (Array.isArray(eligibilityDetails.fileVerificationType)) {
      return eligibilityDetails.fileVerificationType[0];
    }

    return eligibilityDetails.fileVerificationType ?? 'Unknown verification method selected';
  }, [eligibilityDetails.fileVerificationType]);

  const firstVerificationMethodDescription = useMemo(() => {
    if (firstVerificationMethodTitle === 'Work Contract') {
      return (
        <>
          Must show NHS/HSC
          <br />
          Must show your full name
        </>
      );
    }

    return undefined;
  }, [firstVerificationMethodTitle]);

  return {
    title: firstVerificationMethodTitle,
    description: firstVerificationMethodDescription,
  };
}

function useSecondVerificationMethodDetails(
  eligibilityDetails: EligibilityDetails
): VerificationMethodTitleAndDescription | undefined {
  const secondVerificationMethodTitle = useMemo(() => {
    if (
      !Array.isArray(eligibilityDetails.fileVerificationType) ||
      eligibilityDetails.fileVerificationType.length !== 2
    ) {
      return undefined;
    }

    return eligibilityDetails.fileVerificationType[1];
  }, [eligibilityDetails.fileVerificationType]);

  const secondVerificationMethodDescription = useMemo(() => {
    if (secondVerificationMethodTitle === 'Bank Statement') {
      return 'Must show the social care department within the council\nMust show your full name';
    }

    return undefined;
  }, [secondVerificationMethodTitle]);

  if (!secondVerificationMethodTitle) return undefined;

  return {
    title: secondVerificationMethodTitle,
    description: secondVerificationMethodDescription,
  };
}
