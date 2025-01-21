import { ChangeEvent, FC, useId } from 'react';
import { colours, fonts } from '../../tailwind/theme';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { conditionalStrings } from '../../utils/conditionalStrings';
import FloatingPlaceholder from '../FloatingPlaceholder';
import { DropdownSelectOption, DropdownSelectProps } from './types';

const DropdownSelect: FC<DropdownSelectProps> = ({
  id,
  label = '',
  selectedValue,
  options,
  onSelect,
  disabled = false,
  error = false,
  placeholder = '',
}) => {
  const randomId = useId();
  const elementId = id ?? randomId;
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSelectedValue = e.target.value;
    const newSelectedOption = options.find(({ id }) => id === newSelectedValue);
    onSelect(newSelectedOption as DropdownSelectOption);
  };

  const dropdownContainerStyles = conditionalStrings({
    'flex justify-between items-center relative w-full rounded-[4px] border cursor-pointer': true,
    [colours.backgroundSurfaceContainer]: disabled,
    [colours.backgroundSurface]: !disabled,
    [colours.borderError]: error,
    [colours.borderOnSurfaceOutline]: !error,
  });

  const inputClassName = conditionalStrings({
    [`${fonts.body} ${colours.borderOnSurfaceOutline} w-full h-12 px-4 pt-3 rounded-[4px] appearance-none`]:
      true,
    [`${colours.backgroundSurfaceContainer} ${colours.textOnSurfaceDisabled}`]: disabled,
    [`${colours.backgroundSurface} ${colours.textOnSurface}`]: !disabled,
  });

  return (
    <label>
      {label}
      <div className={dropdownContainerStyles}>
        <select
          id={elementId}
          value={selectedValue}
          onChange={onChange}
          className={inputClassName}
          disabled={disabled}
        >
          {!selectedValue ? <option value={''} disabled></option> : null}
          {options.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <FloatingPlaceholder htmlFor={elementId} hasValue={!!selectedValue}>
          {placeholder}
        </FloatingPlaceholder>

        <FontAwesomeIcon
          className={`${disabled ? colours.textOnSurfaceDisabled : colours.textOnSurfaceSubtle}} ${fonts.body} px-4 py-3 absolute right-0 top-0 pointer-events-none`}
          size="sm"
          icon={faChevronDown}
          data-testid="dropdown-expand-icon"
        />
      </div>
    </label>
  );
};

export default DropdownSelect;
