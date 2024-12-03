import FileSelectionBody from '@bluelightcard/shared-ui/components/FileUpload/FileSelectionBody';
import React, { FC, useEffect, useMemo } from 'react';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import FileUploadCounter from '@bluelightcard/shared-ui/components/FileUpload/FileUploadCounter';
import FileUploadStatusCard from '@bluelightcard/shared-ui/components/FileUpload/FileUploadStatusCard';
import { useFileUploadState } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/hooks/use-file-upload-state/UseFileUploadState';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { fileUploadVerificationEvents } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/amplitude-events/FileUploadVerificationEvents';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
  onFilesChanged: OnFilesChanged;
  maxNumberOfFilesToUpload: number;
}

export type OnFilesChanged = (files: File[]) => void;

const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
const maxFileSizeInBytes = 20_000_000;

export const EligibilityFileUpload: FC<Props> = ({
  eligibilityDetailsState,
  onFilesChanged,
  maxNumberOfFilesToUpload,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();

  const { selectedFiles, fileSelectionError, onFilesAdded, onFileRemoved } = useFileUploadState(
    eligibilityDetailsState,
    maxNumberOfFilesToUpload
  );

  const disableFileUpload = useMemo(() => {
    return selectedFiles.length >= maxNumberOfFilesToUpload;
  }, [maxNumberOfFilesToUpload, selectedFiles.length]);

  const validFiles = useMemo(() => {
    return selectedFiles
      .filter((fileDetails) => fileDetails.status === 'success')
      .map((fileDetails) => fileDetails.file);
  }, [selectedFiles]);

  useEffect(() => {
    onFilesChanged(validFiles);
  }, [validFiles, onFilesChanged]);

  return (
    <div className="flex flex-col gap-[12px]">
      <FileSelectionBody
        onFilesSelected={(files) => {
          logAnalyticsEvent(fileUploadVerificationEvents.onChooseFileClicked(eligibilityDetails));
          onFilesAdded(files);
        }}
        disabled={disableFileUpload}
        allowedFileTypes={allowedFileTypes}
        maxFileSize={maxFileSizeInBytes}
        isError={fileSelectionError !== undefined}
      />

      {fileSelectionError && (
        <p className={`${colours.textError} ${fonts.body}`}>{fileSelectionError}</p>
      )}

      <FileUploadCounter
        currentNumberOfUploads={selectedFiles.length}
        expectedNumberOfUploads={maxNumberOfFilesToUpload}
      />

      {selectedFiles.map((fileDetails) => (
        <FileUploadStatusCard
          key={`${fileDetails.file.name}-${fileDetails.file.lastModified}`}
          fileName={fileDetails.file.name}
          uploadStatus={fileDetails.status}
          removeFile={() => {
            logAnalyticsEvent(fileUploadVerificationEvents.onRemoveFileClicked(eligibilityDetails));

            onFileRemoved(fileDetails);
          }}
          message={fileDetails.failedReason}
        />
      ))}
    </div>
  );
};
