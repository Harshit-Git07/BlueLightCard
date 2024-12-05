import { useCallback, useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useVerificationDescriptions } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/hooks/use-verification-methods/hooks/UseVerificationDescriptions';
import { ListSelectorProps } from '@bluelightcard/shared-ui/components/ListSelector/types';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { verificationMethodEvents } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/amplitude-events/VerificationMethodEvents';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';

type VerificationMethod = Pick<
  ListSelectorProps,
  'title' | 'description' | 'tag' | 'onClick' | 'showTrailingIcon'
>;

export function useVerificationMethods(
  eligibilityDetailsState: EligibilityDetailsState
): VerificationMethod[] {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const { getDescriptionByTitle } = useVerificationDescriptions();
  const isMobile = useMobileMediaQuery();
  const logAnalyticsEvent = useLogAmplitudeEvent();

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
      // TODO: This is just a hack to get the multi-id to work in regards to fuzzy frontend
      if (eligibilityDetails.requireMultipleIds) {
        setEligibilityDetails({
          ...eligibilityDetails,
          currentScreen: 'File Upload Verification Screen',
          fileVerificationType: ['NHS Smart Card', verificationType],
        });
        return;
      }

      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'File Upload Verification Screen',
        fileVerificationType: verificationType,
      });
    },
    [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]
  );

  return useMemo(() => {
    const methodTitles = ['Work Email', 'NHS Smart Card', 'Payslip', 'Work ID Card'];

    return methodTitles.map((title) => {
      const description = getDescriptionByTitle(title);
      const onClick =
        title === 'Work Email'
          ? handleWorkEmailVerification
          : () => handleFileUploadVerification(title);

      return {
        ...description,
        onClick: onClick,
        showTrailingIcon: !isMobile,
      };
    });
  }, [getDescriptionByTitle, handleWorkEmailVerification, isMobile, handleFileUploadVerification]);
}
