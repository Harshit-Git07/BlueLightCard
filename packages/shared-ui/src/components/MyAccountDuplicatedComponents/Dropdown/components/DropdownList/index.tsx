import { CSSProperties, FC, useMemo } from 'react';
import DropdownListItem from '../DropdownListItem';
import { DropdownListProps, DropdownOption } from '../../types';
import { colours, fonts } from '../../../../../tailwind/theme';

const DropdownList: FC<DropdownListProps> = ({
  className,
  listboxRef,
  dropdownId,
  options,
  maxItemsShown,
  disabled,
  selectedOption,
  onSelected,
  onOptionKeyDown,
}) => {
  const listboxStyles: CSSProperties = useMemo(() => {
    const height = !maxItemsShown ? 'auto' : `${48 * maxItemsShown}px`;

    return { height };
  }, [maxItemsShown]);

  return (
    <div
      ref={listboxRef}
      id={`dropdown-listbox-${dropdownId}`}
      className={`${className} z-10 absolute w-full mt-2 overflow-y-auto focus:outline-none rounded-b-md cursor-pointer border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark border ${colours.backgroundSurface} ${colours.textOnSurface} ${fonts.body}`}
      style={listboxStyles}
      role="listbox"
      tabIndex={0}
      data-testid="dropdownList"
    >
      {options.length > 0 &&
        options.map((option: DropdownOption, index: number) => (
          <DropdownListItem
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

export default DropdownList;
