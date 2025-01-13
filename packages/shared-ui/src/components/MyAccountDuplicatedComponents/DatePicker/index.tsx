import { FC, useEffect, useId, useMemo, useState } from 'react';
import Dropdown from '../Dropdown';
import { DatePickerProps, SplitDate } from './types';
import moment from 'moment';
import { DropdownOption } from '../Dropdown/types';
import ValidationMessage from '../../../components/ValidationMessage';
import FieldLabel from '../../../components/FieldLabel';

const getMaxDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const generateDateOptions = (value?: SplitDate) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startYear = currentYear - 100;
  const yearLength = currentYear - startYear + 1;

  const yearOptions = Array.from({ length: yearLength }, (_, i) => {
    const year = (startYear + i).toString();
    return {
      id: year,
      label: year,
    };
  }).reverse();

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    id: `${i}`,
    label: `${i + 1}`,
  }));

  const selectedYear = value?.year ?? currentYear;
  const selectedMonth = (value?.month ?? currentDate.getMonth()) + 1;
  const dayOptions = Array.from(
    { length: getMaxDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => ({
      id: `${i + 1}`,
      label: `${i + 1}`,
    }),
  );

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
  id,
  label,
  value,
  onChange,
  isValid,
  validationMessage,
  isDisabled,
}) => {
  const randomId = useId();
  const elementId = id ?? randomId;

  const [date, setDate] = useState<SplitDate>(getSplitFromDate(value));

  const { yearOptions, monthOptions, dayOptions } = useMemo(
    () => generateDateOptions(date),
    [date],
  );

  useEffect(() => {
    setDate(getSplitFromDate(value));
  }, [value]);

  const changed = (newDate: SplitDate) => {
    const m = moment(newDate);
    const YYYYMMDD = m.format('YYYY-MM-DD');
    if (!m.isValid() || !newDate.day || !newDate.month === undefined || !newDate.year) {
      // update internal state anyway
      setDate(newDate);
      onChange && onChange(); // Set's parent state to undefined allowing for form validation.
      return;
    }

    // the controlling component can choose to update this component's prop value if it wants to
    const createdDate = new Date(YYYYMMDD);
    onChange && onChange(createdDate);
  };

  const handleDayChange = (selectedDay: DropdownOption) => {
    changed({ ...date, day: +selectedDay.id });
  };

  const handleMonthChange = (selectedMonth: DropdownOption) => {
    const selectedYear = date.year ?? new Date().getFullYear();
    const selectedDay = date.day ?? new Date().getDay();
    const daysInNewMonth = getMaxDaysInMonth(selectedYear, +selectedMonth.label);
    const updatedDay = daysInNewMonth < selectedDay ? undefined : selectedDay;

    changed({ ...date, month: +selectedMonth.id, day: updatedDay });
  };

  const handleYearChange = (selectedYear: DropdownOption) => {
    const selectedMonth = (date.month ?? new Date().getMonth()) + 1;
    const selectedDay = date.day ?? new Date().getDay();

    const daysInNewMonth = getMaxDaysInMonth(+selectedYear.label, selectedMonth);
    const updatedDay = daysInNewMonth < selectedDay ? undefined : selectedDay;

    changed({ ...date, year: +selectedYear.id, day: updatedDay });
  };

  const monthValue = date.month !== undefined ? monthOptions[date.month] : undefined;

  return (
    <div>
      <FieldLabel htmlFor={elementId} label={label} />
      <div className="flex flex-row gap-[8px]" aria-labelledby={label}>
        <Dropdown
          aria-label="day"
          aria-invalid={!isValid}
          options={dayOptions}
          maxItemsShown={4}
          placeholder={'Day'}
          isValid={isValid}
          value={date.day !== undefined ? dayOptions[date.day - 1] : undefined}
          onChange={handleDayChange}
          isDisabled={isDisabled}
        />

        <Dropdown
          aria-label="month"
          aria-invalid={!isValid}
          options={monthOptions}
          placeholder="Month"
          maxItemsShown={4}
          isValid={isValid}
          value={monthValue}
          onChange={handleMonthChange}
          isDisabled={isDisabled}
        />

        <Dropdown
          aria-label="year"
          aria-invalid={!isValid}
          options={yearOptions}
          placeholder="Year"
          maxItemsShown={4}
          isValid={isValid}
          value={
            date.year !== undefined
              ? yearOptions.find((option) => +option.label === date.year)
              : undefined
          }
          onChange={handleYearChange}
          isDisabled={isDisabled}
        />
      </div>

      <ValidationMessage
        htmlFor={elementId}
        isValid={isValid}
        isDisabled={isDisabled ?? false}
        message={validationMessage}
      />
    </div>
  );
};

export default DatePicker;
