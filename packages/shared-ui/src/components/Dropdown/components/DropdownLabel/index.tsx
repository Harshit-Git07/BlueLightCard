import { FC } from 'react';
import { DropdownLabelProps, TooltipItemProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';

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
    <label
      id={labelId}
      htmlFor={dropdownId}
      className="text-colour-onSurface dark:text-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body"
    >
      {label}
    </label>

    {showTooltipIcon && tooltipText && (
      <TooltipItem tooltipText={tooltipText} isOpen={tooltipOpen}>
        <FontAwesomeIcon
          className="text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark"
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
