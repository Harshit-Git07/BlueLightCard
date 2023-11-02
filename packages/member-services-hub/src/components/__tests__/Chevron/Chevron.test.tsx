import Chevron from '../../Chevron/Chevron';
import { ChevronProps } from '../../Chevron/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Chevron component', () => {
  let props: ChevronProps;

  beforeEach(() => {
    props = {
      id: 'almightyChevron',
      dropdownClicked: false,
      setDropdownClicked: jest.fn(),
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Chevron {...props} />);
      const header = screen.getAllByRole('img', { hidden: true });
      expect(header).toBeTruthy();
    });
  });
});
