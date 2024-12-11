import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Dropdown from '../Dropdown';
import { DatePickerProps, SplitDate } from './types';
import FieldLabel from '../FieldLabel';
import moment from 'moment';
import { DropdownOption } from '../Dropdown/types';
import ValidationMessage from '../ValidationMessage';

const generateDateOptions = (minAgeConstraint: number = 0) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startYear = currentYear - 100;
  const endYear = currentYear - minAgeConstraint;
  const yearLength = endYear - startYear + 1;

  const yearOptions = Array.from({ length: yearLength }, (_, i) => {
    const year = (startYear + i).toString();
    return {
      id: year,
      label: year,
    };
  }).reverse();

  const monthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ].map((month, i) => ({
    id: `${i}`,
    label: month,
  }));

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    id: `${i + 1}`,
    label: `${i + 1}`,
  }));

  return {
    yearOptions,
    monthOptions,
    dayOptions,
  };
};

const getSplitFromDate = (value?: Date): SplitDate => {
  return value
    ? {
        day: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear(),
      }
    : {
        day: undefined,
        month: undefined,
        year: undefined,
      };
};

const DatePicker: FC<DatePickerProps> = ({
  value,
  disabled,
  errorMessage,
  onChange,
  minAgeConstraint,
  ...fieldLabelProps
}) => {
  const calculateAge = useCallback((birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  const { yearOptions, monthOptions, dayOptions } = useMemo(
    () => generateDateOptions(minAgeConstraint),
    [minAgeConstraint],
  );

  const [date, setDate] = useState<SplitDate>(getSplitFromDate(value));
  useEffect(() => {
    setDate(getSplitFromDate(value));
  }, [value]);

  const changed = (newDate: SplitDate) => {
    const m = moment(newDate);
    const YYYYMMDD = m.format('YYYY-MM-DD');
    if (!m.isValid() || !newDate.day || !newDate.month === undefined || !newDate.year) {
      // update internal state anyway
      setDate(newDate);
      onChange();
      return;
    }

    // the controlling component can choose to update this component's prop value if it wants to
    const createdDate = new Date(YYYYMMDD);
    onChange(createdDate);
  };

  const handleDayChange = (selectedDay: DropdownOption) => {
    changed({ ...date, day: +selectedDay.id });
  };

  const handleMonthChange = (selectedMonth: DropdownOption) => {
    changed({ ...date, month: +selectedMonth.id });
  };

  const handleYearChange = (selectedYear: DropdownOption) => {
    changed({ ...date, year: +selectedYear.id });
  };

  let isUnderAge = false;
  if (date.day && date.month && date.year) {
    isUnderAge = calculateAge(new Date(date.year, date.month, date.day)) < (minAgeConstraint ?? 0);
  }

  const isDateValid = !date.day || moment(date).isValid();
  const isInvalid = !isDateValid || isUnderAge;
  const hasError = !disabled && (!!errorMessage || isInvalid);

  const monthValue = date.month !== undefined ? monthOptions[date.month] : undefined;

  return (
    <div>
      <FieldLabel {...fieldLabelProps} />
      <div
        className="flex flex-col sm:flex-row tablet:gap-[8px] mobile:gap-[16px]"
        aria-labelledby={fieldLabelProps.label}
      >
        <Dropdown
          aria-label="day"
          aria-invalid={hasError}
          options={dayOptions}
          maxItemsShown={4}
          placeholder={'Day'}
          isValid={!hasError}
          value={date.day !== undefined ? dayOptions[date.day - 1] : undefined}
          onChange={handleDayChange}
          isDisabled={disabled}
        />

        <Dropdown
          aria-label="month"
          aria-invalid={hasError}
          options={monthOptions}
          placeholder="Month"
          maxItemsShown={4}
          isValid={!hasError}
          value={monthValue}
          onChange={handleMonthChange}
          isDisabled={disabled}
        />

        <Dropdown
          aria-label="year"
          aria-invalid={hasError}
          options={yearOptions}
          placeholder="Year"
          maxItemsShown={4}
          isValid={!hasError}
          value={
            date.year !== undefined
              ? yearOptions.find((option) => +option.label === date.year)
              : undefined
          }
          onChange={handleYearChange}
          isDisabled={disabled}
        />
      </div>

      {hasError ? (
        <ValidationMessage
          htmlFor={fieldLabelProps.htmlFor}
          isValid={false}
          isDisabled={disabled ?? false}
          message={!isDateValid ? 'Date is invalid' : errorMessage}
        />
      ) : null}
    </div>
  );
};

export default DatePicker;
