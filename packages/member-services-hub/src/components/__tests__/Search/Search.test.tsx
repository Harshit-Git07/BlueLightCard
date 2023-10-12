import Search from '../../Search/Search';
import { SearchProps } from '../../Search/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Search component', () => {
  let props: SearchProps;

  beforeEach(() => {
    props = {
      id: 'profilePicture',
      show: true,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Search {...props} />);
      const searchbox = screen.getAllByRole('textbox')[0];
      expect(searchbox).toBeTruthy();
    });
  });
});
