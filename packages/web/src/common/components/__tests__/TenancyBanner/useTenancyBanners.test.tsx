import AuthContext, { AuthContextType } from '@/context/Auth/AuthContext';
import UserContext, { UserContextType } from '@/context/User/UserContext';
import useTenancyBanners from '../../TenancyBanner/useTenancyBanners';
import { AuthedAmplitudeExperimentProvider } from '../../../context/AmplitudeExperiment';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { Factory } from 'fishery';
import { NetworkStatus } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, renderHook, waitFor } from '@testing-library/react';
import { makeHomePageQueryWithDislikeRestrictions } from '@/root/src/graphql/makeQuery';
import { makeQuery } from '@/root/src/graphql/makeQuery';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    isReady: true,
  }),
}));

jest.mock('@/root/src/graphql/makeQuery');

const makeQueryMock = jest.mocked(makeQuery);
const makeHomePageQueryMock = jest.mocked(makeHomePageQueryWithDislikeRestrictions);

jest.mock('@/hooks/useBrazeContentCards', () => ({
  useBrazeContentCards: jest.fn().mockReturnValue([
    {
      imageUrl: 'test-image-1.jpg',
      url: 'test-link-1',
      title: 'Test Braze Card 1',
      isControl: false,
      extras: { destination: 'takeover-banner' },
      logClick: jest.fn(),
    },
    {
      imageUrl: 'test-image-2.jpg',
      url: 'test-link-2',
      title: 'Test Braze Card 2',
      isControl: false,
      extras: { destination: 'bottom-banner' },
      logClick: jest.fn(),
    },
    {
      imageUrl: 'test-image-3.jpg',
      url: 'test-link-3',
      title: 'Test Braze Card 3 (Other location)',
      isControl: false,
      extras: { destination: 'somewhere-else' },
      logClick: jest.fn(),
    },
    {
      imageUrl: 'test-image-4.jpg',
      url: 'test-link-4',
      title: 'Test Braze Card 4 (Control)',
      isControl: true,
      extras: { destination: 'takeover-banner' },
      logClick: jest.fn(),
    },
    {
      imageUrl: 'test-image-5.jpg',
      url: 'test-link-5',
      title: 'Test Braze Card 5 (Control)',
      isControl: true,
      extras: { destination: 'bottom-banner' },
      logClick: jest.fn(),
    },
  ]),
}));

const userContextTypeFactory = Factory.define<UserContextType>(() => ({
  dislikes: [],
  error: undefined,
  isAgeGated: false,
  setUser: () => undefined,
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: 'mock-dob',
      organisation: 'mock-organisation',
    },
    uuid: 'mock-uuid',
  },
}));

const mockExperimentClient = {
  variant: jest.fn().mockReturnValue({ value: 'control' }),
} as unknown as ExperimentClient;

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
  const mockAuthContext: Partial<AuthContextType> = {
    authState: {
      idToken: '23123',
      accessToken: '111',
      refreshToken: '543',
      username: 'test',
    },
    isUserAuthenticated: () => true,
  };
  const userContext = userContextTypeFactory.build();

  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={userContext}>
        <AuthContext.Provider value={mockAuthContext as AuthContextType}>
          <AuthedAmplitudeExperimentProvider
            initExperimentClient={() => Promise.resolve(mockExperimentClient)}
          >
            {children}
          </AuthedAmplitudeExperimentProvider>
        </AuthContext.Provider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

describe('useTenancyBanners hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GraphQL banners', () => {
    beforeEach(() => {
      makeHomePageQueryMock.mockResolvedValue({
        data: {
          offerMenus: {
            deals: [],
            flexible: [],
            features: [],
            marketPlace: [],
          },
          banners: [
            {
              imageSource: 'https://test1.image',
              link: 'https://test1.link',
            },
          ],
        },
        loading: false,
        networkStatus: NetworkStatus.ready,
      });

      makeQueryMock.mockResolvedValue({
        data: {
          banners: [
            {
              imageSource: 'https://test2.image',
              link: 'https://test2.link',
            },
          ],
        },
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    });

    it('returns tenancy banner data', async () => {
      const banners = renderHook(() => useTenancyBanners(), { wrapper });

      expect(banners.result.current).toEqual({ loaded: false, banners: { large: [], small: [] } });

      await waitFor(() => {
        expect(banners.result.current).toEqual({
          loaded: true,
          banners: {
            large: [{ imageSource: 'https://test1.image', link: 'https://test1.link' }],
            small: [{ imageSource: 'https://test2.image', link: 'https://test2.link' }],
          },
        });
      });

      banners.unmount();
    });
  });

  describe('Braze banners', () => {
    beforeEach(() => {
      mockExperimentClient.variant = jest.fn().mockReturnValue({ value: 'treatment' });
    });

    it('returns tenancy banner data', async () => {
      const banners = renderHook(() => useTenancyBanners(), { wrapper });

      expect(banners.result.current).toEqual({ loaded: false, banners: { large: [], small: [] } });

      await waitFor(() => {
        expect(banners.result.current).toEqual({
          loaded: true,
          banners: {
            large: [
              {
                imageSource: 'test-image-1.jpg',
                link: 'test-link-1',
                title: 'Test Braze Card 1',
                logClick: expect.any(Function),
              },
            ],
            small: [
              {
                imageSource: 'test-image-2.jpg',
                link: 'test-link-2',
                title: 'Test Braze Card 2',
                logClick: expect.any(Function),
              },
            ],
          },
        });
      });
    });

    it('does not include control cards', async () => {
      const banners = renderHook(() => useTenancyBanners(), { wrapper });

      await waitFor(() => {
        expect(banners.result.current.banners.small).not.toContain(
          expect.objectContaining({ title: 'Test Braze Card 4 (Control)' })
        );
        expect(banners.result.current.banners.large).not.toContain(
          expect.objectContaining({ title: 'Test Braze Card 5 (Control)' })
        );
      });
    });

    it('does not include cards for other locations', async () => {
      const banners = renderHook(() => useTenancyBanners(), { wrapper });

      await waitFor(() => {
        const otherBanner = expect.objectContaining({
          title: 'Test Braze Card 3 (Other location)',
        });

        expect(banners.result.current.banners.small).not.toContain(otherBanner);
        expect(banners.result.current.banners.large).not.toContain(otherBanner);
      });
    });

    it('does not call GraphQL queries', async () => {
      renderHook(() => useTenancyBanners(), { wrapper });

      await waitFor(() => {
        expect(makeQueryMock).not.toHaveBeenCalled();
        expect(makeHomePageQueryMock).not.toHaveBeenCalled();
      });
    });
  });
});
