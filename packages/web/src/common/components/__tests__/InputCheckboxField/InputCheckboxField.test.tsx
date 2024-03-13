import { fireEvent, render, screen } from '@testing-library/react';
import { InputCheckboxFieldProps } from '@/components/InputCheckboxField/types';
import InputCheckboxField from '@/components/InputCheckboxField/InputCheckboxField';
import '@testing-library/jest-dom';

describe('InputCheckboxField component', () => {
  let props: InputCheckboxFieldProps;

  beforeEach(() => {
    props = {
      id: '1',
      label: 'Checkbox Label',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputCheckboxField {...props} />);
    });
  });

  describe('component rendering', () => {
    it('should output label next to checkbox', () => {
      render(<InputCheckboxField {...props} />);

      const checkbox = screen.getByLabelText('Checkbox Label');
      expect(checkbox).toBeTruthy();
    });
  });

  describe('component functionality', () => {
    it('should invoke onChange callback and toggle value', () => {
      const onChangeMockFn = jest.fn();
      props.onChange = onChangeMockFn;

      render(<InputCheckboxField {...props} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(onChangeMockFn).toHaveBeenCalled();
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });
});
