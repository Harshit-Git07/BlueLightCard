import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Dropdown from '../Dropdown';
import { DropdownOption } from '../Dropdown/types';
import InfoWrapper from '../InfoWrapper';
import { fonts } from '../../tailwind/theme';
import { DatePickerProps, SplitDate } from './types';

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
    id: `${i + 1}`,
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

const DatePicker: FC<DatePickerProps> = ({
  value,
  disabled,
  errorMessage,
  onChange,
  minAgeConstraint,
  ...infoProps
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

  const initialDate: SplitDate = value
    ? {
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear(),
      }
    : {
        day: undefined,
        month: undefined,
        year: undefined,
      };

  const [date, setDate] = useState<SplitDate>(initialDate);

  const handleDayChange = (selectedDay: DropdownOption) => {
    setDate({
      ...date,
      day: +selectedDay.id,
    });
  };
  const handleMonthChange = (selectedMonth: DropdownOption) => {
    setDate({
      ...date,
      month: +selectedMonth.id,
    });
  };
  const handleYearChange = (selectedYear: DropdownOption) => {
    setDate({
      ...date,
      year: +selectedYear.id,
    });
  };

  const maxDays: number =
    date.month && date.year ? new Date(date.year, date.month, 0).getDate() : 31;

  let isUnderAge = false;
  if (date.day && date.month && date.year) {
    isUnderAge =
      calculateAge(new Date(date.year, date.month - 1, date.day)) < (minAgeConstraint ?? 0);
  }

  const isDateInvalid = !!date.day && date.day > maxDays;
  const isInvalid = isDateInvalid || isUnderAge;
  const hasError = !disabled && (!!errorMessage || isInvalid);

  useEffect(() => {
    if (isInvalid) {
      onChange();
      return;
    }

    if (date.day && date.month && date.year) {
      const createdDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
      if (!createdDate) {
        onChange();
        return;
      }

      onChange(createdDate);
    }
  }, [date, isInvalid]);

  return (
    <InfoWrapper {...infoProps}>
      <div
        className="flex flex-col sm:flex-row tablet:gap-[8px] mobile:gap-[16px]"
        aria-labelledby={infoProps.id}
      >
        <Dropdown
          aria-label="day"
          aria-invalid={hasError}
          options={dayOptions}
          placeholder="Day"
          error={hasError}
          maxItemsShown={4}
          selectedValue={date.day?.toString()}
          onSelect={handleDayChange}
          disabled={disabled}
        />

        <Dropdown
          aria-label="month"
          aria-invalid={hasError}
          options={monthOptions}
          placeholder="Month"
          error={hasError}
          maxItemsShown={4}
          selectedValue={date.month?.toString()}
          onSelect={handleMonthChange}
          disabled={disabled}
        />

        <Dropdown
          aria-label="year"
          aria-invalid={hasError}
          options={yearOptions}
          placeholder="Year"
          error={hasError}
          maxItemsShown={4}
          selectedValue={date.year?.toString()}
          onSelect={handleYearChange}
          disabled={disabled}
        />
      </div>

      {hasError && (
        <p className={`${fonts.bodySmall} text-colour-error`} role="alert">
          {isInvalid ? 'Date is invalid' : errorMessage}
        </p>
      )}
    </InfoWrapper>
  );
};
export default DatePicker;
