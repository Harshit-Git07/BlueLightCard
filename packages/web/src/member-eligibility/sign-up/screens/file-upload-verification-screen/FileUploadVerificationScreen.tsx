import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { ListSelectorState } from '@bluelightcard/shared-ui/components/ListSelector/types';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/sign-up/screens/file-upload-verification-screen/hooks/FuzzyFrontendButtons';
import Link from '@/components/Link/Link';
import Alert from '@bluelightcard/shared-ui/components/Alert';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { useVerificationMethodDetails } from '@/root/src/member-eligibility/sign-up/screens/file-upload-verification-screen/hooks/VeificationMethodDetails';
import { usePrivacyPolicyUrl } from '@/root/src/member-eligibility/sign-up/screens/file-upload-verification-screen/hooks/PrivacyPolicyUrl';
import {
  EligibilityFileUpload,
  OnFilesChanged,
} from '@/root/src/member-eligibility/sign-up/screens/file-upload-verification-screen/components/EligibilityFileUpload';
import { EligibilityHeading } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/components/EligibilityHeading';

export const FileUploadVerificationScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const fuzzyFrontendButtons = useFuzzyFrontendButtons(eligibilityDetailsState);
  const { firstVerificationMethod, secondVerificationMethod } =
    useVerificationMethodDetails(eligibilityDetails);
  const privacyPolicyUrl = usePrivacyPolicyUrl();

  const selectedFiles = useMemo(() => {
    return eligibilityDetails.fileVerification ?? [];
  }, [eligibilityDetails]);

  const maxNumberOfFilesToUpload = useMemo(() => {
    return typeof eligibilityDetails.fileVerificationType === 'string' ? 1 : 2;
  }, [eligibilityDetails]);

  const enoughFilesSelectedForUpload = useMemo(() => {
    if (typeof eligibilityDetails.fileVerificationType === 'string') {
      return selectedFiles.length === 1;
    }

    return selectedFiles.length === 2;
  }, [eligibilityDetails.fileVerificationType, selectedFiles.length]);

  const verificationMethodsHeader = useMemo(() => {
    const optionalPlural = eligibilityDetails.requireMultipleIds ? 'S' : '';

    return `VERIFICATION METHOD${optionalPlural}`;
  }, [eligibilityDetails.requireMultipleIds]);

  const onFilesChanged: OnFilesChanged = useCallback(
    (files) => {
      const fileVerification = files?.length !== 0 ? files : undefined;
      if (eligibilityDetails.fileVerification === fileVerification) return;

      setEligibilityDetails({
        ...eligibilityDetails,
        fileVerification,
      });
    },
    [eligibilityDetails, setEligibilityDetails]
  );

  const onNext = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Delivery Address Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  const onBack = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <EligibilityScreen>
      <EligibilityBody className="gap-[32px]">
        <div className="flex flex-col gap-[24px]">
          <EligibilityHeading
            title="Verify Eligibility"
            subtitle="Upload the required ID to verify your eligibility"
            numberOfCompletedSteps={3}
          />

          <div className="flex flex-col gap-[16px]">
            <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>
              {verificationMethodsHeader}
            </p>

            <ListSelector
              title={firstVerificationMethod.title}
              description={firstVerificationMethod.description}
              state={ListSelectorState.Selected}
              onClick={onBack}
            />

            {secondVerificationMethod && (
              <>
                <div className={`${fonts.bodySmallSemiBold} ${colours.textOnSurface}`}>AND</div>

                <ListSelector
                  title={secondVerificationMethod.title}
                  description={secondVerificationMethod.description}
                  state={ListSelectorState.Selected}
                  onClick={onBack}
                />
              </>
            )}
          </div>
        </div>

        <hr className="w-full" />

        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <div className={`${fonts.bodySmallSemiBold} ${colours.textOnSurface}`}>
                Upload from your device or camera
              </div>

              <div className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}>
                Remember to place on plain, well lit surface with no obstructions, blur or glare
              </div>
            </div>

            <EligibilityFileUpload
              onFilesChanged={onFilesChanged}
              maxNumberOfFilesToUpload={maxNumberOfFilesToUpload}
            />
          </div>

          {selectedFiles.length > 0 && (
            <Alert
              variant="Inline"
              title="Any documents uploaded will be deleted from our servers."
              state="Info"
              icon="fa-solid fa-circle-info"
              isFullWidth
            >
              <Link href={privacyPolicyUrl}>Read candidate privacy policy</Link>
            </Alert>
          )}

          {enoughFilesSelectedForUpload && (
            <Button onClick={onNext} size="Large">
              Submit ID
            </Button>
          )}
        </div>
      </EligibilityBody>

      <FuzzyFrontendButtons buttons={fuzzyFrontendButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
