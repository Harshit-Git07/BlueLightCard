import FileSelectionBody from '@bluelightcard/shared-ui/components/FileUpload/FileSelectionBody';
import React, { FC, useEffect, useMemo } from 'react';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import FileUploadCounter from '@bluelightcard/shared-ui/components/FileUpload/FileUploadCounter';
import FileUploadStatusCard from '@bluelightcard/shared-ui/components/FileUpload/FileUploadStatusCard';
import { UploadStatus } from '@bluelightcard/shared-ui/components/FileUpload/types';
import { useFileUploadState } from '@/root/src/member-eligibility/sign-up/screens/file-upload-verification-screen/components/hooks/UseFileUploadState';

interface Props {
  onFilesChanged: OnFilesChanged;
  maxNumberOfFilesToUpload: number;
}

export type OnFilesChanged = (files: File[]) => void;

const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
const maxFileSizeInBytes = 20_000_000;

export const EligibilityFileUpload: FC<Props> = ({ onFilesChanged, maxNumberOfFilesToUpload }) => {
  const { selectedFiles, fileSelectionError, onFilesAdded, onFileRemoved } =
    useFileUploadState(maxNumberOfFilesToUpload);

  const disableFileUpload = useMemo(() => {
    return selectedFiles.length >= maxNumberOfFilesToUpload;
  }, [maxNumberOfFilesToUpload, selectedFiles.length]);

  useEffect(() => {
    onFilesChanged(selectedFiles);
  }, [onFilesChanged, selectedFiles]);

  return (
    <div className="flex flex-col gap-[12px]">
      <FileSelectionBody
        onFilesSelected={onFilesAdded}
        disabled={disableFileUpload}
        allowedFileTypes={allowedFileTypes}
        maxFileSize={maxFileSizeInBytes}
      />

      {fileSelectionError && (
        <p className={`${colours.textError} ${fonts.body}`}>{fileSelectionError}</p>
      )}

      <FileUploadCounter
        currentNumberOfUploads={selectedFiles.length}
        expectedNumberOfUploads={maxNumberOfFilesToUpload}
      />

      {selectedFiles.map((file) => (
        <FileUploadStatusCard
          key={`${file.name}-${file.lastModified}`}
          fileName={file.name}
          uploadStatus={UploadStatus.Success}
          removeFile={() => onFileRemoved(file)}
        />
      ))}
    </div>
  );
};
