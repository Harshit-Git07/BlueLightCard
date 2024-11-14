import { useCallback, useState } from 'react';

interface FileUploadState {
  selectedFiles: File[];
  fileSelectionError: string | undefined;
  onFilesAdded: OnFilesAdded;
  onFileRemoved: OnFileRemoved;
}

export type OnFilesAdded = (newFilesSelectedForUpload: File[]) => void;
type OnFileRemoved = (fileToRemove: File) => void;

export function useFileUploadState(maxNumberOfFiles: number): FileUploadState {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileSelectionError, setFileSelectionError] = useState<string | undefined>(undefined);

  const onFilesAdded: OnFilesAdded = useCallback(
    (newFilesSelectedForUpload) => {
      const validationError = getValidationError(
        selectedFiles,
        newFilesSelectedForUpload,
        maxNumberOfFiles
      );
      if (validationError) {
        setFileSelectionError(validationError);
        return;
      }

      setSelectedFiles([...selectedFiles, ...newFilesSelectedForUpload]);
    },
    [maxNumberOfFiles, selectedFiles]
  );

  const onFileRemoved: OnFileRemoved = useCallback(
    (fileToRemove) => {
      setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
    },
    [selectedFiles]
  );

  return {
    selectedFiles,
    fileSelectionError,
    onFilesAdded,
    onFileRemoved,
  };
}

export function getValidationError(
  filesAlreadySelectedForUpload: File[],
  newFilesSelectedForUpload: File[],
  maxNumberOfAllowedFiles: number
): string | undefined {
  const newNumberOfFiles = filesAlreadySelectedForUpload.length + newFilesSelectedForUpload.length;

  if (newNumberOfFiles > maxNumberOfAllowedFiles) {
    const optionalPlural = maxNumberOfAllowedFiles > 1 ? 's' : '';
    return `Only ${maxNumberOfAllowedFiles} file${optionalPlural} can be uploaded`;
  }

  return undefined;
}
