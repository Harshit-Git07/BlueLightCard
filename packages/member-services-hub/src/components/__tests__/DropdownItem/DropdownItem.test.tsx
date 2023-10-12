import DropdownItem from '../../DropdownItem/DropdownItem';
import { DropdownProps } from '../../DropdownItem/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('drop down item component', () => {
  let props: DropdownProps;

  beforeEach(() => {
    props = {
      id: 'dropdownId',
      name: 'myAccount',
      link: '#/',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<DropdownItem {...props} />);
      const link = screen.getAllByRole('link')[0];
      expect(link).toBeTruthy();
    });
  });
});
