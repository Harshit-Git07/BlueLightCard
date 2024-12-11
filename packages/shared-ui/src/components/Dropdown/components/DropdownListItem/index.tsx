import { FC, useMemo } from 'react';
import { DropdownListItemProps } from '../../types';

const DropdownListItem: FC<DropdownListItemProps> = ({
  option,
  index,
  selectedOption,
  disabled,
  onSelected,
  onOptionKeyDown,
}) => {
  const isSelected = useMemo(() => {
    return selectedOption === option;
  }, [selectedOption, option]);

  const selectedStyles = useMemo(() => {
    if (!isSelected) return '';

    return 'border-b border-b-dropDownItem-bg-colour dark:border-b-dropDownItem-bg-colour-dark';
  }, [isSelected]);

  const className = useMemo(() => {
    return `flex h-7 items-center cursor-pointer p-5 focus:text-dropDownItem-text-active-colour focus:border-b-dropDownItem-border-active-colour border-b border-transparent hover:bg-dropDownItem-bg-hover-colour hover:text-dropDownItem-text-hover-colour hover:border-b-dropDownItem-divider-hover-colour dark:focus:text-dropDownItem-text-active-colour-dark dark:focus:border-b-dropDownItem-border-active-colour-dark dark:hover:bg-dropDownItem-bg-hover-colour-dark dark:hover:text-dropDownItem-text-hover-colour-dark  dark:hover:border-b-dropDownItem-divider-hover-colour-dark font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark ${selectedStyles}`;
  }, [selectedStyles]);

  return (
    <option
      key={option.id}
      className={className}
      aria-disabled={disabled}
      aria-selected={isSelected}
      tabIndex={index + 1}
      onClick={() => !disabled && onSelected(option)}
      onKeyDown={(event) => !disabled && onOptionKeyDown(event, option)}
    >
      {option.label}
    </option>
  );
};

export default DropdownListItem;
