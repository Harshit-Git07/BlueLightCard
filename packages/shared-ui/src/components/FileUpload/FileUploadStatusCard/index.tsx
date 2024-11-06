import { FC, MouseEvent } from 'react';
import { UploadStatus } from '../types';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { faCheckCircle, faXmark, faXmarkCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { colours, fonts } from '../../../tailwind/theme';

const getStatusCardIconAndColours = (
  uploadStatus: UploadStatus,
): [IconDefinition, string, string] => {
  switch (uploadStatus) {
    case UploadStatus.Ready:
    case UploadStatus.Loading:
      return [faSpinner, colours.textPrimary, colours.borderOnSurfaceOutline];
    case UploadStatus.Success:
      return [faCheckCircle, colours.textSuccess, colours.borderSuccess];
    case UploadStatus.Error:
      return [faXmarkCircle, colours.textError, colours.borderError];
  }
};

export type Props = {
  fileName: string;
  uploadStatus: UploadStatus;
  removeFile: (event: MouseEvent<HTMLButtonElement>) => void;
  message?: string;
};

const FileUploadStatusCard: FC<Props> = ({ fileName, uploadStatus, removeFile, message }) => {
  const [icon, iconColour, borderColour] = getStatusCardIconAndColours(uploadStatus);
  return (
    <div>
      <div
        className={`p-6 flex gap-2 items-center justify-center border rounded ${colours.backgroundSurfaceContainer} ${borderColour}`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`h-6 w-6 ${iconColour}`}
          spin={icon === faSpinner}
        />
        <p className={`truncate ${colours.textOnSurface}`}>{fileName}</p>
        <FileUploadCloseButton removeFile={removeFile} />
      </div>
      {message ? <p className={`${iconColour} ${fonts.bodySmall}`}>{message}</p> : null}
    </div>
  );
};

type CloseButtonProps = {
  removeFile: (event: MouseEvent<HTMLButtonElement>) => void;
};

const FileUploadCloseButton: FC<CloseButtonProps> = ({ removeFile }) => (
  <button onClick={removeFile} className="ml-auto flex">
    <FontAwesomeIcon icon={faXmark} className={`h-6 w-6 ${colours.textOnSurfaceSubtle}`} />
  </button>
);

export default FileUploadStatusCard;
