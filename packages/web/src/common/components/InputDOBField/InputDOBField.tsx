import { FC, forwardRef, useEffect, useRef, useState } from 'react';
import InputTextField from '@/components/InputTextField/InputTextField';
import { DOBFields, InputDOBFieldProps } from './types';
import { number } from 'yup';
import useKeyConstraint from '@/hooks/useKeyConstraint';

const maxDayNumber = 31;
const maxMonthNumber = 12;
const defaultDate = new Date();
/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/DatePicker/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */

const InputDOBField: FC<InputDOBFieldProps> = ({
  value,
  error,
  success,
  required,
  onChange,
  dobDelimiter = '/',
  minAgeConstraint = 16,
}) => {
  const maxFallbackYear = defaultDate.getFullYear();
  const maxYear = maxFallbackYear - minAgeConstraint;
  const initialRender = useRef(true);

  // populated dob value
  const dobValues = value?.split(dobDelimiter);
  const { day, month, year }: DOBFields = {
    day: dobValues?.[0],
    month: dobValues?.[1],
    year: dobValues?.[2],
  };

  const [dobValue, setDOBValue] = useState<DOBFields>({
    day: undefined,
    month: undefined,
    year: undefined,
  });

  const { captureInput } = useKeyConstraint({
    validationSchema: {
      dd: number().max(maxDayNumber),
      mm: number().max(maxMonthNumber),
      yyyy: number().max(maxYear),
    },
  });

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (onChange) {
        onChange([dobValue.day, dobValue.month, dobValue.year].join(dobDelimiter));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dobValue]);

  return (
    <div className="flex gap-4">
      <div className="w-full">
        <InputTextField
          value={day}
          success={success}
          error={error}
          type="number"
          min={0}
          max={maxDayNumber}
          name="day"
          placeholder="DD"
          required={required}
          onChange={(ev) => setDOBValue({ ...dobValue, day: ev.currentTarget.value })}
          onKeyDown={(ev) => captureInput(ev, 'dd')}
        />
      </div>
      <div className="w-full">
        <InputTextField
          value={month}
          success={success}
          error={error}
          type="number"
          min={0}
          max={maxMonthNumber}
          name="month"
          placeholder="MM"
          required={required}
          onChange={(ev) => setDOBValue({ ...dobValue, month: ev.currentTarget.value })}
          onKeyDown={(ev) => captureInput(ev, 'mm')}
        />
      </div>
      <div className="w-full">
        <InputTextField
          value={year}
          success={success}
          error={error}
          type="number"
          min={0}
          max={maxYear}
          name="year"
          placeholder="YYYY"
          required={required}
          onChange={(ev) => setDOBValue({ ...dobValue, year: ev.currentTarget.value })}
          onKeyDown={(ev) => captureInput(ev, 'yyyy')}
        />
      </div>
    </div>
  );
};

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/DatePicker/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */
// eslint-disable-next-line react/display-name
const InputDOBFieldWithRef = forwardRef<unknown, InputDOBFieldProps>((props, ref) => (
  <InputDOBField {...props} _ref={ref} />
));

export default InputDOBFieldWithRef;
