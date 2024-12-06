import { useCallback, useMemo, useState } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { uploadFileToServiceLayer } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/hooks/use-file-upload-state/service-layer/UploadFile';
import { UploadStatus } from '@bluelightcard/shared-ui/components/FileUpload/types';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';

interface FileUploadState {
  selectedFiles: FileDetails[];
  fileSelectionError: string | undefined;
  onFilesAdded: OnFilesAdded;
  onFileRemoved: OnFileRemoved;
}

interface FileDetails {
  file: File;
  status: UploadStatus;
  failedReason?: string;
}

export type OnFilesAdded = (newFilesSelectedForUpload: File[]) => Promise<void>;
type OnFileRemoved = (fileToRemove: FileDetails) => void;

export function useFileUploadState(
  eligibilityDetailsState: EligibilityDetailsState,
  maxNumberOfFiles: number
): FileUploadState {
  const [eligibilityDetails] = eligibilityDetailsState;

  const [selectedFiles, setSelectedFiles] = useState<FileDetails[]>([]);
  const [fileSelectionError, setFileSelectionError] = useState<string | undefined>(undefined);

  const updateMemberProfile = useUpdateMemberProfile(eligibilityDetailsState);

  const selectedFilesAsFiles = useMemo(() => {
    return selectedFiles.map((fileDetails) => fileDetails.file);
  }, [selectedFiles]);

  const handleFileUploadResult = useCallback(
    async (file: File) => {
      try {
        await uploadFileToServiceLayer(eligibilityDetails, file);
        setSelectedFiles((files) => {
          const index = files.findIndex((fileDetails) => fileDetails.file === file);
          if (index === -1) return files;

          const clonedFiles = [...files];
          clonedFiles[index] = {
            file,
            status: UploadStatus.Success,
          };
          return clonedFiles;
        });
      } catch (error) {
        console.error('Failed to upload file', error);
        setSelectedFiles((files) => {
          const index = files.findIndex((fileDetails) => fileDetails.file === file);
          if (index === -1) return files;

          const clonedFiles = [...files];
          clonedFiles[index] = {
            file,
            status: UploadStatus.Error,
            failedReason: 'Upload failed, please remove and try again',
          };
          return clonedFiles;
        });
      }
    },
    [eligibilityDetails]
  );

  const uploadNewFiles = useCallback(
    (newFilesSelectedForUpload: File[]) => {
      const newFilesWithLoadingStatus: FileDetails[] = newFilesSelectedForUpload.map((newFile) => {
        return {
          file: newFile,
          status: UploadStatus.Loading,
        };
      });
      setSelectedFiles([...selectedFiles, ...newFilesWithLoadingStatus]);
      setFileSelectionError(undefined);

      for (const file of newFilesSelectedForUpload) {
        handleFileUploadResult(file);
      }
    },
    [handleFileUploadResult, selectedFiles]
  );

  const onFilesAdded: OnFilesAdded = useCallback(
    async (newFilesSelectedForUpload) => {
      const validationError = getValidationError(
        selectedFilesAsFiles,
        newFilesSelectedForUpload,
        maxNumberOfFiles
      );
      if (validationError) {
        setFileSelectionError(validationError);
        return;
      }

      await updateMemberProfile();
      uploadNewFiles(newFilesSelectedForUpload);
    },
    [maxNumberOfFiles, selectedFilesAsFiles, updateMemberProfile, uploadNewFiles]
  );

  const onFileRemoved: OnFileRemoved = useCallback((fileToRemove) => {
    setSelectedFiles((selectedFiles) => {
      return selectedFiles.filter((fileDetails) => fileDetails.file !== fileToRemove.file);
    });
    setFileSelectionError(undefined);
  }, []);

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
