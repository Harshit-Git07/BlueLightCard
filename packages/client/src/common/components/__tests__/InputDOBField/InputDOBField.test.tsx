import { render, screen } from '@testing-library/react';
import InputDOBField from '@/components/InputDOBField/InputDOBField';
import { InputDOBFieldProps } from '@/components/InputDOBField/types';

describe('InputDOBField component', () => {
  let props: InputDOBFieldProps;

  beforeEach(() => {
    props = {};
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputDOBField {...props} />);
    });
  });

  describe('component rendering', () => {
    it('should render dob fields with populated values', () => {
      props.value = '12/05/2005';
      render(<InputDOBField {...props} />);

      const dayField = screen.getByDisplayValue('12');
      const monthField = screen.getByDisplayValue('05');
      const yearField = screen.getByDisplayValue('2005');

      expect(dayField).toBeTruthy();
      expect(monthField).toBeTruthy();
      expect(yearField).toBeTruthy();
    });

    it('should render dob fields with populated values matching delimiter', () => {
      props.value = '12-05-2005';
      props.dobDelimiter = '-';
      render(<InputDOBField {...props} />);

      const dayField = screen.getByDisplayValue('12');
      const monthField = screen.getByDisplayValue('05');
      const yearField = screen.getByDisplayValue('2005');

      expect(dayField).toBeTruthy();
      expect(monthField).toBeTruthy();
      expect(yearField).toBeTruthy();
    });
  });
});
