import Checkbox from '../../Checkbox/Checkbox';
import { CheckboxProps } from '../../Checkbox/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Check box component', () => {
  let props: CheckboxProps;

  beforeEach(() => {
    props = {
      label: 'checkbox label',
      prechecked: false,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Checkbox {...props} />);
      const label = screen.getByTestId('checkbox-label');

      expect(label).toBeTruthy();
    });

    it('selecting radial should produce different results', () => {
      render(<Checkbox {...props} style="radial" />);
      const label = screen.getByTestId('checkbox-label-radial');

      expect(label).toBeTruthy();
    });
  });
});
