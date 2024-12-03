import { FC, MouseEvent } from 'react';
import { UploadStatus } from '../types';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colours, fonts } from '../../../tailwind/theme';
import { FileUploadCloseButton } from './components/FileUploadCloseButton';
import { useStatusCardIconAndColours } from './hooks/UseStatusCardIconAndColours';

export type FileUploadStatusCardProps = {
  fileName: string;
  uploadStatus: UploadStatus;
  removeFile: (event: MouseEvent<HTMLButtonElement>) => void;
  message?: string;
};

const FileUploadStatusCard: FC<FileUploadStatusCardProps> = ({
  fileName,
  uploadStatus,
  removeFile,
  message,
}) => {
  const { icon, iconColour, borderColour } = useStatusCardIconAndColours(uploadStatus);

  return (
    <div>
      <div
        className={`${colours.backgroundSurfaceContainer} ${borderColour} p-[16px] flex gap-[8px] items-center justify-center border rounded`}
      >
        <FontAwesomeIcon
          className={`${iconColour} h-[24px] w-[24px]`}
          icon={icon}
          spin={icon === faSpinner}
        />

        <p className={`${colours.textOnSurface} truncate`}>{fileName}</p>

        <FileUploadCloseButton removeFile={removeFile} />
      </div>

      {message ? <p className={`${iconColour} ${fonts.bodySmall}`}>{message}</p> : null}
    </div>
  );
};

export default FileUploadStatusCard;
