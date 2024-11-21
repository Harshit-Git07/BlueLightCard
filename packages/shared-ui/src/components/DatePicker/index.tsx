import { FC, useEffect, useState } from 'react';
import Dropdown from '../Dropdown';
import { DropdownOption } from '../Dropdown/types';
import InfoWrapper from '../InfoWrapper';
import { fonts } from '../../tailwind/theme';
import { DatePickerProps, SplitDate } from './types';

const startYear = new Date().getFullYear() - 100;
const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  id: `${i + 1}`,
  label: `${i + 1}`,
}));

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
].map((month, i) => {
  return {
    id: `${i + 1}`,
    label: month,
  };
});

const yearOptions = Array.from({ length: 100 }, (_, i) => {
  const year: string = (i + 1 + startYear).toString();
  return {
    id: year,
    label: year,
  };
}).reverse();

const DatePicker: FC<DatePickerProps> = ({
  value,
  disabled,
  errorMessage,
  onChange,
  ...infoProps
}) => {
  const initialDate: SplitDate = value
    ? { day: value.getDate(), month: value.getMonth() + 1, year: value.getFullYear() }
    : { day: undefined, month: undefined, year: undefined };

  const [date, setDate] = useState<SplitDate>(initialDate);

  const handleDayChange = (selectedDay: DropdownOption) => {
    setDate({ ...date, day: +selectedDay.id });
  };
  const handleMonthChange = (selectedMonth: DropdownOption) => {
    setDate({ ...date, month: +selectedMonth.id });
  };
  const handleYearChange = (selectedYear: DropdownOption) => {
    setDate({ ...date, year: +selectedYear.id });
  };

  const maxDays: number =
    date.month && date.year ? new Date(date.year, date.month, 0).getDate() : 31;

  const isInvalid: boolean = !!date.day && date.day > maxDays;
  const hasError: boolean = !disabled && (!!errorMessage || isInvalid);

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
      <div aria-labelledby={infoProps.id} className="flex flex-col sm:flex-row gap-2">
        <Dropdown
          aria-label="day"
          aria-invalid={hasError}
          options={dayOptions}
          placeholder={'Day'}
          error={hasError}
          maxItemsShown={5}
          selectedValue={date.day?.toString()}
          onSelect={handleDayChange}
          disabled={disabled}
        />
        <Dropdown
          aria-label="month"
          aria-invalid={hasError}
          options={monthOptions}
          placeholder={'Month'}
          error={hasError}
          maxItemsShown={5}
          selectedValue={date.month?.toString()}
          onSelect={handleMonthChange}
          disabled={disabled}
        />
        <Dropdown
          aria-label="year"
          aria-invalid={hasError}
          options={yearOptions}
          placeholder={'Year'}
          error={hasError}
          maxItemsShown={5}
          selectedValue={date.year?.toString()}
          onSelect={handleYearChange}
          disabled={disabled}
        />
      </div>
      {hasError ? (
        <p className={`${fonts['bodySmall']} text-colour-error`} role="alert">
          {isInvalid ? 'Date is invalid' : errorMessage}
        </p>
      ) : null}
    </InfoWrapper>
  );
};
export default DatePicker;
