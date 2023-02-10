import { FC } from 'react';
import InputTextField from '@/components/InputTextField/InputTextField';
import { InputDOBFieldProps } from './types';
import { Col, Row } from 'react-bootstrap';
import { number } from 'yup';
import useKeyConstraint from '@/hooks/useKeyConstraint';

const maxDayNumber = 31;
const maxMonthNumber = 12;
const defaultDate = new Date();

const InputDOBField: FC<InputDOBFieldProps> = ({
  dd,
  mm,
  yyyy,
  onChange,
  minAgeConstraint = 16,
}) => {
  const maxFallbackYear = defaultDate.getFullYear();
  const maxYear = maxFallbackYear - minAgeConstraint;

  const { captureInput } = useKeyConstraint({
    validationSchema: {
      dd: number().max(maxDayNumber),
      mm: number().max(maxMonthNumber),
      yyyy: number().max(maxYear),
    },
  });

  return (
    <Row>
      <Col>
        <InputTextField
          value={dd?.value}
          error={dd?.error}
          type="number"
          min={0}
          max={maxDayNumber}
          placeholder={dd?.placeholder ?? 'DD'}
          onChange={onChange}
          onKeyDown={(ev) => captureInput(ev, 'dd')}
        />
      </Col>
      <Col>
        <InputTextField
          value={mm?.value}
          error={mm?.error}
          type="number"
          min={0}
          max={maxMonthNumber}
          placeholder={mm?.placeholder ?? 'MM'}
          onChange={onChange}
          onKeyDown={(ev) => captureInput(ev, 'mm')}
        />
      </Col>
      <Col>
        <InputTextField
          value={yyyy?.value}
          error={yyyy?.error}
          type="number"
          min={0}
          max={maxYear}
          placeholder={yyyy?.placeholder ?? 'YYYY'}
          onChange={onChange}
          onKeyDown={(ev) => captureInput(ev, 'yyyy')}
        />
      </Col>
    </Row>
  );
};

export default InputDOBField;
