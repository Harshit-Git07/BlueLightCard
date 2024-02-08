import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchModule from '../index';
import { SearchModuleProps } from '../types';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SearchModule', () => {
  let props: SearchModuleProps;
  let useRouterMock: jest.Mock;

  beforeEach(() => {
    props = {};
    useRouterMock = useRouter as jest.Mock;
  });

  describe('search overlay', () => {
    it('should display search overlay', async () => {
      render(<SearchModule />);

      const searchInput = screen.getByRole('searchbox');

      await act(() => userEvent.click(searchInput));

      expect(screen.getByText('Your recent searches')).toBeTruthy();
    });
  });

  describe('search', () => {
    it('should navigate to searchresults on submit search', async () => {
      const pushMock = jest.fn();
      useRouterMock.mockReturnValue({
        push: pushMock,
      });

      render(<SearchModule />);

      const searchInput = screen.getByRole('searchbox');

      await act(() => userEvent.type(searchInput, 'test'));

      fireEvent.submit(searchInput);

      expect(pushMock).toHaveBeenCalledWith('/searchresults?searchTerm=test');
    });
  });
});
