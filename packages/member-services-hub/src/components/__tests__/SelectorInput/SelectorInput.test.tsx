import SelectorInput from '../../SelectorInput/SelectorInput';
import { SelectorInputProps } from '../../SelectorInput/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Selector component', () => {
  let props: SelectorInputProps;

  beforeEach(() => {
    props = {
      label: 'Dropdown',
      disabled: false,
      placeholder: 'click here',
      options: [{ optionName: 'an' }, { optionName: 'option' }, { optionName: 'haha' }],
      width: '250px',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<SelectorInput {...props} />);
      const label = screen.getByTestId('selector-label');

      expect(label).toBeTruthy();
    });
  });
});
