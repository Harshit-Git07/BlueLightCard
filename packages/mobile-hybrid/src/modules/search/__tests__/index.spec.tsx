import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchModule, { Props } from '../index';
import { useRouter } from 'next/router';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import {
  IPlatformAdapter,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui';
import { backNavagationalPaths } from '../components/use-cases/SearchWithNavContainer';
import { act } from 'react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SearchModule', () => {
  let useRouterMock: jest.Mock;
  let user: UserEvent;

  beforeEach(() => {
    useRouterMock = useRouter as jest.Mock;
    user = userEvent.setup();
    useRouterMock.mockReturnValue({
      route: '',
    });
  });

  describe('search overlay', () => {
    it('should display search overlay', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith({
        mockPlatformAdapter,
        featureFlags: {
          [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
        },
      });

      await whenSearchInputIsClicked(user);

      expect(screen.getByText('Your recent searches')).toBeInTheDocument();
    });

    it('should not display search overlay when feature is off', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith({
        mockPlatformAdapter,
        featureFlags: {
          [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'off',
        },
      });

      await whenSearchInputIsClicked(user);

      expect(screen.queryByText('Your recent searches')).not.toBeInTheDocument();
    });

    it('should hide search overlay', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith({
        mockPlatformAdapter,
        featureFlags: {
          [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
        },
      });

      await whenSearchInputIsClicked(user);

      await whenBackButtonIsClicked(user);

      expect(screen.queryByText('Your recent searches')).not.toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('should navigate to searchresults on submit search when useDeeplinkVersion is FALSE', async () => {
      const pushMockFn = jest.fn();

      useRouterMock.mockReturnValue({
        push: pushMockFn,
      });

      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith({
        mockPlatformAdapter,
        featureFlags: {
          [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
        },
      });

      const searchInput = screen.getByRole('searchbox');

      await act(() => userEvent.type(searchInput, 'test'));

      await waitFor(() => {
        expect(searchInput).toHaveValue('test');
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(pushMockFn).toHaveBeenCalledWith('/searchresults?search=test');
      });
    });

    it('should navigate via deeplink to search results page on submit search when useDeeplinkVersion is TRUE', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith({
        mockPlatformAdapter,
        featureFlags: {
          [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
        },
        useDeeplinkVersion: true,
      });

      const searchInput = screen.getByRole('searchbox');

      await act(() => userEvent.type(searchInput, 'test'));

      await waitFor(() => {
        expect(searchInput).toHaveValue('test');
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(mockPlatformAdapter.navigate).toHaveBeenCalledWith(
          `/offers.php?type=1&opensearch=1&search=${encodeURIComponent('test')}`,
        );
      });
    });
  });

  describe('back navigation', () => {
    it.each(backNavagationalPaths)(
      'should navigate back a page when route matches %s',
      async (route) => {
        const replaceMockFn = jest.fn();
        useRouterMock.mockReturnValue({
          route,
          replace: replaceMockFn,
        });

        const mockPlatformAdapter = useMockPlatformAdapter();
        givenSearchModuleIsRenderedWith({
          mockPlatformAdapter,
          featureFlags: {
            [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
          },
        });

        const searchInput = screen.getByRole('searchbox');

        await act(async () => {
          await user.type(searchInput, 'test');
        });

        await whenBackButtonIsClicked(user);

        expect(replaceMockFn).toHaveBeenCalled();
      },
    );

    it.each(['/search', '/'])(
      'should NOT navigate back a page when route matches non back navigational paths such as %s',
      async (route) => {
        const replaceMockFn = jest.fn();
        useRouterMock.mockReturnValue({
          route,
          replace: replaceMockFn,
        });

        const mockPlatformAdapter = useMockPlatformAdapter();
        givenSearchModuleIsRenderedWith({
          mockPlatformAdapter,
          featureFlags: {
            [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
          },
        });

        const searchInput = screen.getByRole('searchbox');

        await act(async () => {
          await user.type(searchInput, 'test');
        });

        await whenBackButtonIsClicked(user);

        expect(replaceMockFn).not.toHaveBeenCalled();
      },
    );
  });
});

const givenSearchModuleIsRenderedWith = ({
  mockPlatformAdapter,
  featureFlags,
  useDeeplinkVersion,
}: { mockPlatformAdapter: IPlatformAdapter; featureFlags: Record<string, string> } & Props) => {
  render(
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
        <SearchModule useDeeplinkVersion={useDeeplinkVersion} />
      </JotaiTestProvider>
    </PlatformAdapterProvider>,
  );
};

const whenSearchInputIsClicked = async (user: UserEvent) => {
  await act(async () => {
    const searchInput = screen.getByRole('searchbox');
    await user.click(searchInput);
  });
};

const whenBackButtonIsClicked = async (user: UserEvent) => {
  await act(async () => {
    const backBtn = screen.getByRole('button', { name: 'Back button' });
    await user.click(backBtn);
  });
};
