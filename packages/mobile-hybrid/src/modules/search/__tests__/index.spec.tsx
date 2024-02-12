import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchModule from '../index';
import { SearchModuleProps } from '../types';
import { useRouter } from 'next/router';
import { backNavagationalPaths } from '../paths';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SearchModule', () => {
  let props: SearchModuleProps;
  let useRouterMock: jest.Mock;
  let user: UserEvent;

  beforeEach(() => {
    props = {};
    useRouterMock = useRouter as jest.Mock;
    user = userEvent.setup();
  });

  describe('search overlay', () => {
    it('should display search overlay', async () => {
      useRouterMock.mockReturnValue({
        route: '',
      });

      render(<SearchModule />);

      const searchInput = screen.getByRole('searchbox');

      await user.click(searchInput);

      expect(screen.getByText('Your recent searches')).toBeInTheDocument();
    });

    it('should hide search overlay', async () => {
      useRouterMock.mockReturnValue({
        route: '',
      });

      render(<SearchModule />);

      const searchInput = screen.getByRole('searchbox');

      await user.click(searchInput);

      const backBtn = screen.getByRole('button', { name: 'Back button' });

      await user.click(backBtn);

      expect(screen.queryByText('Your recent searches')).not.toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('should navigate to searchresults on submit search', async () => {
      const pushMockFn = jest.fn();
      useRouterMock.mockReturnValue({
        push: pushMockFn,
      });

      render(<SearchModule />);

      const searchInput = screen.getByRole('searchbox');

      await act(() => userEvent.type(searchInput, 'test'));

      fireEvent.submit(searchInput);

      expect(pushMockFn).toHaveBeenCalledWith('/searchresults?searchTerm=test');
    });
  });

  describe('back navigation', () => {
    it.each(backNavagationalPaths)(
      'should navigate back a page when route matches %s',
      async (route) => {
        const backMockFn = jest.fn();
        useRouterMock.mockReturnValue({
          route,
          back: backMockFn,
        });

        render(<SearchModule />);

        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'test');

        const backBtn = screen.getByRole('button', { name: 'Back button' });

        await user.click(backBtn);

        expect(backMockFn).toHaveBeenCalled();
      },
    );

    it.each(['/search', '/'])(
      'should NOT navigate back a page when route matches non back navigational paths such as %s',
      async (route) => {
        const backMockFn = jest.fn();
        useRouterMock.mockReturnValue({
          route,
          back: backMockFn,
        });

        render(<SearchModule />);

        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'test');

        const backBtn = screen.getByRole('button', { name: 'Back button' });

        await user.click(backBtn);

        expect(backMockFn).not.toHaveBeenCalled();
      },
    );
  });
});
