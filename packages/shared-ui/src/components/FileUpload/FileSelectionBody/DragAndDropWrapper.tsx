import { ChangeEvent, DragEvent, FC } from 'react';
import { colours, fonts } from '../../../tailwind/theme';
import FileSelectionInputButton from './InputButton';
import { formatBytes } from '../utils/formatBytes';
import { formatFileTypes } from '../utils/formatFileTypes';
import { useDragging } from '../useDragging';
import { conditionalStrings } from '../../../utils/conditionalStrings';

interface Props {
  handleDrop: (event: DragEvent<HTMLElement>) => void;
  handleButtonClick: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  allowedFileTypes: string[];
  maxFileSize: number;
  isError?: boolean;
}

const FileSelectionDragAndDropWrapper: FC<Props> = ({
  handleDrop,
  handleButtonClick,
  disabled,
  allowedFileTypes,
  maxFileSize,
  isError,
}) => {
  const { dragging, ...draggingProps } = useDragging(handleDrop);

  const getTextColourStyles = (defaultColours: string) =>
    conditionalStrings({
      [colours.textOnSurfaceDisabled]: disabled,
      [colours.textPrimaryHover]: !disabled && dragging,
      [defaultColours]: !disabled && !dragging,
    });

  const containerStyles = conditionalStrings({
    [`p-[24px] flex flex-col items-center gap-[12px] border border-dashed rounded`]: true,
    [colours.backgroundPrimaryContainer]: dragging,
    [colours.backgroundSurfaceContainer]: !dragging,
    [colours.borderPrimaryHover]: dragging && !isError,
    [colours.borderOnSurfaceOutline]: !dragging && !isError,
    [colours.borderError]: isError === true,
  });

  return (
    <section
      className={containerStyles}
      {...(disabled ? {} : draggingProps)}
      aria-label="Dropzone to Upload Files"
    >
      <div className="w-full flex flex-col items-center gap-[24px]">
        <div className={`w-full flex flex-col items-center gap-[12px]`}>
          <FileSelectionInputButton
            handleButtonClick={handleButtonClick}
            allowedFileTypes={allowedFileTypes}
            disabled={disabled}
          />

          <p className={`${getTextColourStyles(colours.textOnSurface)} hidden laptop:block`}>or</p>

          <p
            className={`${fonts.bodySemiBold} ${getTextColourStyles(colours.textOnSurface)} hidden laptop:block`}
          >
            Drag and drop in here
          </p>
        </div>

        <p
          className={`${fonts.bodySmall} ${getTextColourStyles(colours.textOnSurfaceSubtle)} text-center`}
        >
          Max file size is {formatBytes(maxFileSize)}. Supported file types are{' '}
          {formatFileTypes(allowedFileTypes)}
        </p>
      </div>
    </section>
  );
};

export default FileSelectionDragAndDropWrapper;
