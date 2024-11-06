import { FC, useEffect, useState } from 'react';
import { FileInfo, UploadStatus } from '../types';
import { useFileSelector } from '../useFileSelector';
import { validateFile } from '../utils/validateFile';
import { validateFileList } from '../utils/validateFiles';
import { colours, fonts } from '../../../tailwind/theme';
import FileSelectionBody, {
  defaultFileTypes,
  defaultMaxFileSize,
  defaultMaxUploads,
} from '../FileSelectionBody';
import FileUploadLabel from '../FileUploadLabel';
import FileUploadCounter from '../FileUploadCounter';
import FileUploadStatusCard from '../FileUploadStatusCard';

const between1And3Seconds = () => (Math.random() * 2 + 1) * 1000;

export type Props = {
  labelText: string;
  allowedFileTypes: string[];
  expectedNumberOfUploads: number;
  maxFileSize: number;
  validatePasswordProtectedPdfs: boolean;
};

const ExampleUploadWrapper: FC<Props> = ({
  labelText = 'LABEL',
  allowedFileTypes = defaultFileTypes,
  expectedNumberOfUploads = defaultMaxUploads,
  maxFileSize = defaultMaxFileSize,
  validatePasswordProtectedPdfs = true,
}) => {
  const { selectedFiles, addFiles, updateFile, removeFiles } = useFileSelector();
  const [fileSelectionError, setFileSelectionError] = useState<string | null>(null);

  const simulateFileUpload = (file: FileInfo) =>
    setTimeout(
      () =>
        Math.random() < 0.9
          ? updateFile(file.id, {
              ...file,
              uploadStatus: UploadStatus.Success,
              code: 200,
            })
          : updateFile(file.id, {
              ...file,
              uploadStatus: UploadStatus.Error,
              code: 400,
              errorMessage: 'testError',
            }),
      between1And3Seconds(),
    );

  const uploadFile = (file: FileInfo) => {
    updateFile(file.id, { ...file, uploadStatus: UploadStatus.Loading });
    simulateFileUpload(file);
  };

  const handleAddFiles = async (filesToAdd: File[]) => {
    const filesLeft = expectedNumberOfUploads - selectedFiles.length;
    const validationResult = validateFileList(filesToAdd, filesLeft, expectedNumberOfUploads);

    if (validationResult.type === 'error') {
      setFileSelectionError(validationResult.message);
      return;
    }

    setFileSelectionError(null);

    const fileValidationPromises = filesToAdd.map(async (file): Promise<FileInfo> => {
      const fileValidationResult = await validateFile(
        file,
        allowedFileTypes,
        maxFileSize,
        validatePasswordProtectedPdfs,
      );

      const defaultParams = {
        id: `${file.name}-${Date.now()}`, // any method to generate unique id
        file,
      };

      return fileValidationResult.type === 'success'
        ? {
            ...defaultParams,
            uploadStatus: UploadStatus.Ready,
          }
        : {
            ...defaultParams,
            uploadStatus: UploadStatus.Error,
            code: 400,
            errorMessage: fileValidationResult.message,
          };
    });
    const validatedFiles = await Promise.all(fileValidationPromises);

    addFiles(validatedFiles);
  };

  useEffect(() => {
    selectedFiles.forEach((file) => {
      if (file.uploadStatus === UploadStatus.Ready) {
        uploadFile(file);
      }
    });
  }, [selectedFiles]);

  return (
    <div className="w-[350px] flex flex-col gap-3">
      <FileUploadLabel labelText={labelText} />
      <FileSelectionBody
        onFilesSelected={handleAddFiles}
        disabled={selectedFiles.length === expectedNumberOfUploads}
        allowedFileTypes={allowedFileTypes}
        maxFileSize={maxFileSize}
      />
      {fileSelectionError ? (
        <p className={`${colours.textError} ${fonts.body}`}>{fileSelectionError}</p>
      ) : null}
      <FileUploadCounter
        currentNumberOfUploads={selectedFiles.length}
        expectedNumberOfUploads={expectedNumberOfUploads}
      />
      {selectedFiles.map((file) => (
        <FileUploadStatusCard
          key={file.id}
          fileName={file.file.name}
          uploadStatus={file.uploadStatus}
          removeFile={() => removeFiles([file.id])}
          message={file.uploadStatus === UploadStatus.Error ? file.errorMessage : undefined}
        />
      ))}
    </div>
  );
};

export default ExampleUploadWrapper;
