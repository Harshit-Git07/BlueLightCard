import { ChangeEvent, FC } from 'react';
import { ButtonColour } from '../../Button-V2';
import { ThemeVariant } from '../../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/pro-regular-svg-icons';

type Props = {
  handleButtonClick: (event: ChangeEvent<HTMLInputElement>) => void;
  allowedFileTypes: string[];
  disabled: boolean;
};

const FileSelectionInputButton: FC<Props> = ({ handleButtonClick, allowedFileTypes, disabled }) => {
  const { bg, hover, text } = ButtonColour[ThemeVariant.Primary].base;
  const backgroundStyles = disabled
    ? 'bg-button-primary-disabled-bg-colour dark:bg-button-primary-disabled-bg-colour-dark text-button-primary-disabled-label-colour dark:text-button-primary-disabled-label-colour-dark'
    : bg;
  const hoverStyles = disabled ? '' : `${hover} hover:cursor-pointer`;
  const textStyles = `${text} leading-button-label-font font-button-label-font-weight`;

  const inputId = 'Upload File';

  return (
    <label
      className={`w-full px-6 py-2 flex items-center justify-center gap-2 rounded-md ${backgroundStyles} ${hoverStyles} ${textStyles}`}
      htmlFor={inputId}
    >
      <FontAwesomeIcon icon={faUpload} />
      Choose file
      <input
        id={inputId}
        title="Choose file"
        type="file"
        accept={allowedFileTypes.join(',')}
        multiple
        className="h-0 w-0"
        onChange={handleButtonClick}
        disabled={disabled}
        tabIndex={0}
      />
    </label>
  );
};

export default FileSelectionInputButton;
