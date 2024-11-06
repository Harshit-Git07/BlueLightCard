import { ChangeEvent, DragEvent, FC } from 'react';
import { colours, fonts } from '../../../tailwind/theme';
import FileSelectionInputButton from './InputButton';
import { formatBytes } from '../utils/formatBytes';
import { formatFileTypes } from '../utils/formatFileTypes';
import { useDragging } from '../useDragging';
import { conditionalStrings } from '../../../utils/conditionalStrings';

type Props = {
  handleDrop: (event: DragEvent<HTMLElement>) => void;
  handleButtonClick: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  allowedFileTypes: string[];
  maxFileSize: number;
};

const FileSelectionDragAndDropWrapper: FC<Props> = ({
  handleDrop,
  handleButtonClick,
  disabled,
  allowedFileTypes,
  maxFileSize,
}) => {
  const { dragging, ...draggingProps } = useDragging(handleDrop);

  const getTextColourStyles = (defaultColours: string) =>
    conditionalStrings({
      [colours.textOnSurfaceDisabled]: disabled,
      [colours.textPrimaryHover]: !disabled && dragging,
      [defaultColours]: !disabled && !dragging,
    });

  const sectionStyles = conditionalStrings({
    'p-6 flex flex-col items-center gap-3 border border-dashed rounded': true,
    [colours.backgroundPrimaryContainer]: dragging,
    [colours.backgroundSurfaceContainer]: !dragging,
    [colours.borderPrimaryHover]: dragging,
    [colours.borderOnSurfaceOutline]: !dragging,
  });

  return (
    <section
      className={sectionStyles}
      {...(disabled ? {} : draggingProps)}
      aria-label="Dropzone to Upload Files"
    >
      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-3">
          <FileSelectionInputButton
            handleButtonClick={handleButtonClick}
            allowedFileTypes={allowedFileTypes}
            disabled={disabled}
          />
          <p className={`hidden laptop:block ${getTextColourStyles(colours.textOnSurface)}`}>or</p>
          <p
            className={`hidden laptop:block ${fonts.bodySemiBold} ${getTextColourStyles(colours.textOnSurface)}`}
          >
            Drag and drop in here
          </p>
        </div>
        <p
          className={`text-center ${fonts.bodySmall} ${getTextColourStyles(colours.textOnSurfaceSubtle)}`}
        >
          Max file size is {formatBytes(maxFileSize)}. Supported file types are{' '}
          {formatFileTypes(allowedFileTypes)}
        </p>
      </div>
    </section>
  );
};

export default FileSelectionDragAndDropWrapper;
