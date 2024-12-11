import { FC, useEffect, useState } from 'react';
import FileSelectionBody, {
  defaultFileTypes,
  defaultMaxFileSize,
  defaultMaxUploads,
} from '../../../../FileUpload/FileSelectionBody';
import { FileInfo, UploadStatus } from '../../../../FileUpload/types';
import { validateFileList } from '../../../../FileUpload/utils/validateFiles';
import { validateFile } from '../../../../FileUpload/utils/validateFile';
import FileUploadLabel from '../../../../FileUpload/FileUploadLabel';
import { colours, fonts } from '../../../../../tailwind/theme';
import FileUploadStatusCard from '../../../../FileUpload/FileUploadStatusCard';
import FileUploadCounter from '../../../../FileUpload/FileUploadCounter';
import { useFileSelector } from '../../../../FileUpload/useFileSelector';
import useRequestNewCard from '../../../useRequestNewCard';
import useMemberApplicationUploadDocumentPost from '../../../../../hooks/useMemberApplicationUploadDocumentPost';
import useS3Upload from '../../../../../hooks/useS3Upload';

export type Props = {
  labelText?: string;
  allowedFileTypes?: string[];
  expectedNumberOfUploads?: number;
  maxFileSize?: number;
  validatePasswordProtectedPdfs?: boolean;
  onChange: (selectedFiles: FileInfo[]) => void;
};

const FileUpload: FC<Props> = ({
  labelText = 'LABEL',
  allowedFileTypes = defaultFileTypes,
  expectedNumberOfUploads = defaultMaxUploads,
  maxFileSize = defaultMaxFileSize,
  validatePasswordProtectedPdfs = true,
  onChange,
}) => {
  const { memberId, applicationId } = useRequestNewCard();
  const { mutateAsync: getSignedUrl } = useMemberApplicationUploadDocumentPost(
    memberId,
    applicationId,
  );
  const { mutateAsync: uploadToS3 } = useS3Upload();
  const { selectedFiles, addFiles, updateFile, removeFiles } = useFileSelector();
  const [fileSelectionError, setFileSelectionError] = useState<string | null>(null);

  const uploadFile = async (file: FileInfo) => {
    updateFile(file.id, {
      ...file,
      uploadStatus: UploadStatus.Loading,
    });

    // get the signed url
    const { status, data } = await getSignedUrl();
    const { preSignedUrl } = data;
    console.log({ status, preSignedUrl });

    // upload to s3
    const { status: s3Status, data: s3Data } = await uploadToS3({ preSignedUrl, file: file.file });
    console.log({ s3Status, s3Data });

    // update file upload status
    updateFile(file.id, {
      ...file,
      uploadStatus: UploadStatus.Success,
    });
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
    onChange(selectedFiles);
  }, [selectedFiles]);

  return (
    <div className="w-full flex flex-col gap-3">
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

export default FileUpload;
