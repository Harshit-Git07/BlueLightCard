import { FC, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colours } from '../../../../tailwind/theme';
import { faXmark } from '@fortawesome/pro-solid-svg-icons';

interface Props {
  removeFile: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const FileUploadCloseButton: FC<Props> = ({ removeFile }) => (
  <button className="ml-auto flex" onClick={removeFile}>
    <FontAwesomeIcon
      className={`${colours.textOnSurfaceSubtle} h-[20px] w-[20px]`}
      icon={faXmark}
    />
  </button>
);
