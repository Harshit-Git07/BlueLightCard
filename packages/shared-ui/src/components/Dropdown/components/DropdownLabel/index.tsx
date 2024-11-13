import { FC } from 'react';
import { DropdownLabelProps, TooltipItemProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import { colours, fonts } from '../../../../tailwind/theme';

const DropdownLabel: FC<DropdownLabelProps> = ({
  labelId,
  dropdownId,
  label,
  tooltipText,
  tooltipOpen,
  showTooltipIcon,
  tooltipIcon,
  onTooltipClicked,
}) => (
  <div className="gap-[7px] flex items-center">
    <label className={`${colours.textOnSurface} ${fonts.body}`} id={labelId} htmlFor={dropdownId}>
      {label}
    </label>

    {showTooltipIcon && tooltipText && (
      <TooltipItem tooltipText={tooltipText} isOpen={tooltipOpen}>
        <FontAwesomeIcon
          className={`${colours.textOnSurfaceSubtle}`}
          width={14}
          height={14}
          icon={tooltipIcon === undefined || {} ? faCircleInfo : tooltipIcon}
          aria-label="info button"
          onClick={onTooltipClicked}
        />
      </TooltipItem>
    )}
  </div>
);

const TooltipItem: FC<TooltipItemProps> = ({ children, tooltipText, isOpen }) => (
  <div className="group relative inline-block" data-testid="tooltip">
    {children}

    <div
      className={`absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-black px-4 py-[6px] text-sm font-semibold text-white opacity-0 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <span
        className={
          'absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-sm bg-black'
        }
      />

      {tooltipText}
    </div>
  </div>
);

export default DropdownLabel;
