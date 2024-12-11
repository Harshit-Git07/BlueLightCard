import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface DropdownLabelProps {
  labelId: string;
  dropdownId: string;
  label: string;
  tooltipText?: string;
  tooltipOpen: boolean;
  showTooltipIcon?: boolean;
  tooltipIcon?: IconDefinition;
  onTooltipClicked: () => void;
}

export interface TooltipItemProps {
  tooltipText?: string;
  isOpen: boolean;
  children: React.ReactNode;
}
