import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { ListSelectorState } from '@bluelightcard/shared-ui/components/ListSelector/types';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import Alert from '@bluelightcard/shared-ui/components/Alert';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useFuzzyFrontendButtons } from './hooks/FuzzyFrontendButtons';
import { useVerificationMethodDetails } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/hooks/VeificationMethodDetails';
import { usePrivacyPolicyUrl } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/hooks/PrivacyPolicyUrl';
import {
  EligibilityFileUpload,
  OnFilesChanged,
} from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/EligibilityFileUpload';
import {
  defaultScreenTitle,
  idUploadSubTitle,
} from '@/root/src/member-eligibility/shared/constants/TitlesAndSubtitles';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { fileUploadVerificationEvents } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/amplitude-events/FileUploadVerificationEvents';

export const FileUploadVerificationScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

  const { firstVerificationMethod, secondVerificationMethod } =
    useVerificationMethodDetails(eligibilityDetails);
  const privacyPolicyUrl = usePrivacyPolicyUrl();

  const fuzzyFrontendButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 3;
      case 'Renewal':
        return 4;
    }
  }, [eligibilityDetails.flow]);

  const selectedFiles = useMemo(() => {
    return eligibilityDetails.fileVerification ?? [];
  }, [eligibilityDetails]);

  const maxNumberOfFilesToUpload = useMemo(() => {
    if (
      Array.isArray(eligibilityDetails.fileVerificationType) ||
      firstVerificationMethod.title === 'SPPA Headed Letter'
    ) {
      return 2;
    }

    return 1;
  }, [eligibilityDetails.fileVerificationType, firstVerificationMethod.title]);

  const enoughFilesSelectedForUpload = useMemo(() => {
    if (typeof eligibilityDetails.fileVerificationType === 'string') {
      return selectedFiles.length === 1;
    }

    return selectedFiles.length === 2;
  }, [eligibilityDetails.fileVerificationType, selectedFiles.length]);

  const verificationMethodsHeader = useMemo(() => {
    const optionalPlural = eligibilityDetails.requireMultipleIds ? 'S' : '';

    return `UPLOAD THE FOLLOWING DOCUMENT${optionalPlural}`;
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
    logAnalyticsEvent(fileUploadVerificationEvents.onSubmitClicked(eligibilityDetails));

    if (eligibilityDetails.flow === 'Sign Up') {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Delivery Address Screen',
      });
      return;
    }

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Payment Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);

  const onBack = useCallback(() => {
    logAnalyticsEvent(fileUploadVerificationEvents.onEditClicked(eligibilityDetails));

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);

  return (
    <EligibilityScreen>
      <EligibilityBody>
        <div className="flex flex-col gap-[24px]">
          <EligibilityHeading
            title={defaultScreenTitle(eligibilityDetails.flow)}
            subtitle={idUploadSubTitle(eligibilityDetails.flow)}
            numberOfCompletedSteps={numberOfCompletedSteps}
          />

          <div className="flex flex-col gap-[16px]">
            <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>
              {verificationMethodsHeader}
            </p>

            <ListSelector
              {...firstVerificationMethod}
              className={`${
                firstVerificationMethod.showTrailingIcon ? 'cursor-pointer' : 'cursor-default'
              }`}
              state={ListSelectorState.Selected}
              onClick={firstVerificationMethod.showTrailingIcon ? onBack : undefined}
            />

            {secondVerificationMethod && (
              <>
                <div className={`${fonts.bodySmallSemiBold} ${colours.textOnSurface}`}>AND</div>

                <ListSelector
                  {...secondVerificationMethod}
                  className={`${
                    secondVerificationMethod.showTrailingIcon ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  state={ListSelectorState.Selected}
                  onClick={secondVerificationMethod.showTrailingIcon ? onBack : undefined}
                />
              </>
            )}
          </div>
        </div>

        <hr className="w-full" />

        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <div className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}>
                Remember to place on plain, well lit surface with no obstructions, blur or glare
              </div>
            </div>

            <EligibilityFileUpload
              eligibilityDetailsState={eligibilityDetailsState}
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
              <Button variant={ThemeVariant.Tertiary} size="XSmall" href={privacyPolicyUrl}>
                Read candidate privacy policy
              </Button>
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
