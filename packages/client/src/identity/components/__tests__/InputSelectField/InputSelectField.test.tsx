import InputSelectFieldWithRef from '../../InputSelectField/InputSelectField';
import { InputSelectFieldProps, KeyValue } from '../../InputSelectField/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('InputSelectField component', () => {
  let props: InputSelectFieldProps;

  beforeEach(() => {
    props = {
      options: [
        { key: 1, value: 'test' },
        { key: 2, value: 'test' },
      ],
      defaultOption: 'Default Option',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputSelectFieldWithRef {...props} />);

      const inputSelectField = screen.getByDisplayValue('Default Option');

      expect(inputSelectField).toBeTruthy();
    });
  });
});
