import { DropdownItemComponentProps, DropdownListProps } from './types';
import { CSSProperties, FC, useMemo } from 'react';

const DropdownList: FC<DropdownListProps> = ({
  className,
  listboxRef,
  dropdownId,
  maxItemsShown,
  options,
  disabled,
  selectedOption,
  onSelected,
  onOptionKeyDown,
}) => {
  const style: CSSProperties = useMemo(() => {
    const height = !maxItemsShown ? 'auto' : `calc(${40 * maxItemsShown}px)`;

    return { height };
  }, [maxItemsShown]);

  return (
    <div
      ref={listboxRef}
      id={`dropdown-listbox-${dropdownId}`}
      className={`${className} z-50 absolute w-full mt-2 overflow-y-auto focus:outline-none rounded-[4px] cursor-pointer border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark border bg-colour-surface-light dark:bg-colour-surface-dark text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body`}
      style={style}
      role="listbox"
      tabIndex={0}
      data-testid="dropdownList"
    >
      {options.length > 0 &&
        options.map((option, index) => (
          <DropdownItemComponent
            key={option.id}
            option={option}
            index={index}
            selectedOption={selectedOption}
            disabled={disabled}
            onSelected={onSelected}
            onOptionKeyDown={onOptionKeyDown}
          />
        ))}

      {options.length < 1 && (
        <div className="w-full flex h-7 p-5 items-center font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font text-dropDownItem-text-colour text-center text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark">
          No results found
        </div>
      )}
    </div>
  );
};

const DropdownItemComponent: FC<DropdownItemComponentProps> = ({
  option,
  index,
  selectedOption,
  disabled,
  onSelected,
  onOptionKeyDown,
}) => {
  const isSelected = useMemo(() => {
    return selectedOption?.id === option.id;
  }, [selectedOption, option]);

  const selectedStyles = useMemo(() => {
    if (!isSelected) return '';

    return 'border-b border-b-dropDownItem-bg-colour dark:border-b-dropDownItem-bg-colour-dark';
  }, [isSelected]);

  const className = useMemo(() => {
    return `flex h-7 items-center cursor-pointer p-5 focus:text-dropDownItem-text-active-colour focus:border-b-dropDownItem-border-active-colour focus:border-b hover:border-b hover:bg-dropDownItem-bg-hover-colour hover:text-dropDownItem-text-hover-colour hover:border-b-dropDownItem-divider-hover-colour dark:focus:text-dropDownItem-text-active-colour-dark dark:focus:border-b-dropDownItem-border-active-colour-dark dark:hover:bg-dropDownItem-bg-hover-colour-dark dark:hover:text-dropDownItem-text-hover-colour-dark  dark:hover:border-b-dropDownItem-divider-hover-colour-dark font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark ${selectedStyles}`;
  }, [selectedStyles]);

  return (
    <div
      key={option.id}
      className={className}
      role="option"
      aria-disabled={disabled}
      aria-selected={isSelected}
      tabIndex={index + 1}
      onClick={() => onSelected(option)}
      onKeyDown={(event) => onOptionKeyDown(event, option)}
    >
      {option.label}
    </div>
  );
};

export default DropdownList;
