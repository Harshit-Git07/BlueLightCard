import InputSelectField from '@/components/InputSelectField/InputSelectField';
import { InputSelectFieldProps } from '@/components/InputSelectField/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('InputSelectField component', () => {
  let props: InputSelectFieldProps;

  beforeEach(() => {
    props = {
      options: {
        '1': 'Option one',
        '2': 'Option two',
      },
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
