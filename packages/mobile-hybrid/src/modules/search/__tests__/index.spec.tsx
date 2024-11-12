import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchModule from '../index';
import { SearchModuleProps } from '../types';
import { useRouter } from 'next/router';
import { backNavagationalPaths } from '../paths';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import {
  IPlatformAdapter,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../../shared-ui/src/adapters';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('swiper/react', () => ({
  Swiper: () => null,
  SwiperSlide: () => null,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());
jest.mock('swiper/css/pagination', () => jest.fn());
jest.mock('swiper/css/navigation', () => jest.fn());

describe('SearchModule', () => {
  let props: SearchModuleProps;
  let useRouterMock: jest.Mock;
  let user: UserEvent;

  beforeEach(() => {
    props = {};
    useRouterMock = useRouter as jest.Mock;
    user = userEvent.setup();
    useRouterMock.mockReturnValue({
      route: '',
    });
  });

  describe('search overlay', () => {
    it('should not display search overlay', async () => {
      // This has been disabled for the moment due to the recent searches being hard coded and causing a stickiness issue
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
      });

      await whenSearchInputIsClicked(user);

      expect(screen.queryByText('Your recent searches')).not.toBeInTheDocument();
    });

    it('should not display search overlay when feature is off', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'off',
      });

      await whenSearchInputIsClicked(user);

      expect(screen.queryByText('Your recent searches')).not.toBeInTheDocument();
    });

    it('should hide search overlay', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
      });

      await whenSearchInputIsClicked(user);

      await whenBackButtonIsClicked(user);

      expect(screen.queryByText('Your recent searches')).not.toBeInTheDocument();
    });
  });

  describe('search', () => {
    const pushMockFn = jest.fn();
    beforeEach(() => {
      useRouterMock.mockReturnValue({
        push: pushMockFn,
      });
    });
    it('should navigate to searchresults on submit search', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenSearchModuleIsRenderedWith(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
      });

      const searchInput = screen.getByRole('searchbox');

      await act(() => userEvent.type(searchInput, 'test'));

      await waitFor(() => {
        expect(searchInput).toHaveValue('test');
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(pushMockFn).toHaveBeenCalledWith('/searchresults?search=test');
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
        givenSearchModuleIsRenderedWith(mockPlatformAdapter, {
          [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
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
        givenSearchModuleIsRenderedWith(mockPlatformAdapter, {
          [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on',
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

const givenSearchModuleIsRenderedWith = (
  mockPlatformAdapter: IPlatformAdapter,
  featureFlags: any,
) => {
  render(
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
        <SearchModule />
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
