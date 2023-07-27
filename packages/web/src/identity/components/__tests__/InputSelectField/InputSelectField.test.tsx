import InputSelectField from '../../InputSelectField/InputSelectField';
import { InputSelectFieldProps, KeyValue } from '../../InputSelectField/Types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('InputSelectField component', () => {
  let props: InputSelectFieldProps;

  beforeEach(() => {
    props = {
      id: 'input-select-field',
      options: [
        { key: 1, value: 'test' },
        { key: 2, value: 'test' },
      ],
      defaultOption: 'Default Option',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputSelectField {...props} />);

      const inputSelectField = screen.getByDisplayValue('Default Option');

      expect(inputSelectField).toBeTruthy();
    });
  });
});
