import { FC, DragEvent, ChangeEvent } from 'react';
import FileSelectionDragAndDropWrapper from './DragAndDropWrapper';
import { FileSelectionProps } from './types';

export const defaultFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
export const defaultMaxUploads = 3;
export const defaultMaxFileSize = 2e7;

const FileSelectionBody: FC<FileSelectionProps> = ({
  onFilesSelected,
  disabled = false,
  allowedFileTypes = defaultFileTypes,
  maxFileSize = defaultMaxFileSize,
  isError,
}) => {
  const onFileDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    handleFileSelection(files);
  };

  const onButtonClick = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    handleFileSelection(files);
  };

  const handleFileSelection = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);

      if (fileArray.length > 0) {
        onFilesSelected(fileArray);
      }
    }
  };

  return (
    <FileSelectionDragAndDropWrapper
      handleDrop={onFileDrop}
      handleButtonClick={onButtonClick}
      disabled={disabled}
      allowedFileTypes={allowedFileTypes}
      maxFileSize={maxFileSize}
      isError={isError}
    />
  );
};

export default FileSelectionBody;
