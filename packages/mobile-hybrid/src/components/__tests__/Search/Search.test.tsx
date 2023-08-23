import Search from '@/components/Search/Search';
import { SearchProps } from '@/components/Search/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('Search component', () => {
  let props: SearchProps;

  beforeEach(() => {
    props = {
      onSearch: jest.fn(),
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<Search {...props} />);
    });
  });

  describe('Component callbacks', () => {
    it('should invoke onSearch when user submits search', async () => {
      render(<Search {...props} />);

      const searchTerm = 'example';

      const inputElement = screen.getByRole('textbox');

      await act(async () => {
        await userEvent.type(inputElement, `${searchTerm}{enter}`);
      });
      expect(props.onSearch).toHaveBeenCalledWith(searchTerm);
    });
  });
});
