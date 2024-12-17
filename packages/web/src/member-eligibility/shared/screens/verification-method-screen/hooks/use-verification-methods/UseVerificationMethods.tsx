import { useCallback, useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { ListSelectorProps } from '@bluelightcard/shared-ui/components/ListSelector/types';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { verificationMethodEvents } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/amplitude-events/VerificationMethodEvents';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { requiresMultipleIds } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/utils/RequiresMultipleIds';

interface VerificationMethod
  extends Pick<
    ListSelectorProps,
    'title' | 'description' | 'tag' | 'onClick' | 'showTrailingIcon'
  > {
  primary?: boolean;
}

type GroupedVerificationMethods = {
  primaryMethod: VerificationMethod | undefined;
  supportingMethods: VerificationMethod[];
};

export function useVerificationMethods(
  eligibilityDetailsState: EligibilityDetailsState
): GroupedVerificationMethods {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const logAnalyticsEvent = useLogAmplitudeEvent();
  const isMobile = useMobileMediaQuery();

  const handleWorkEmailVerification = useCallback(() => {
    logAnalyticsEvent(verificationMethodEvents.onMethodSelected(eligibilityDetails, 'Work Email'));
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Work Email Verification Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);

  const handleFileUploadVerification = useCallback(
    (verificationType: string) => {
      logAnalyticsEvent(
        verificationMethodEvents.onMethodSelected(eligibilityDetails, verificationType)
      );

      const primaryMethodTitle = eligibilityDetails.currentIdRequirementDetails?.find(
        (requirement) => requirement.required
      )?.title;

      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'File Upload Verification Screen',
        fileVerificationType: requiresMultipleIds(eligibilityDetails)
          ? [primaryMethodTitle ?? verificationType, verificationType]
          : verificationType,
      });
    },
    [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]
  );

  return useMemo(() => {
    const idRequirements = eligibilityDetails.currentIdRequirementDetails ?? [];

    const methods = idRequirements.map((requirement): VerificationMethod => {
      const title = requirement.title;
      const description = requirement.description;
      const onClick =
        requirement.type === 'email'
          ? handleWorkEmailVerification
          : () => handleFileUploadVerification(title);
      const isPrimary = requirement.type !== 'email' ? requirement.required : undefined;

      return {
        title,
        description,
        onClick,
        showTrailingIcon: !isMobile,
        primary: isPrimary,
      };
    });

    const primaryMethod = methods.find((method) => method.primary);
    const supportingMethods = methods.filter((method) => !method.primary);

    return {
      primaryMethod,
      supportingMethods,
    };
  }, [
    eligibilityDetails.currentIdRequirementDetails,
    handleWorkEmailVerification,
    handleFileUploadVerification,
    isMobile,
  ]);
}
