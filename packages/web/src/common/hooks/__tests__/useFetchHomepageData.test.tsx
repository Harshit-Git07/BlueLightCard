import '@testing-library/jest-dom';
import { renderHook, RenderOptions, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import UserContext, { UserContextType } from '@/context/User/UserContext';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { makeHomePageQueryWithDislikeRestrictions } from '@/root/src/graphql/makeQuery';
import { NetworkStatus } from '@apollo/client';
import useFetchHomepageData from '@/hooks/useFetchHomepageData';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import AuthContext, { AuthContextType } from '@/context/Auth/AuthContext';
import { as } from '@core/utils/testing';
import _noop from 'lodash/noop';

let mockPlatformAdapter: ReturnType<typeof useMockPlatformAdapter>;

jest.mock('@/context/AmplitudeExperiment', () => ({
  ...jest.requireActual('@/context/AmplitudeExperiment'),
  useAmplitudeExperiment: jest.fn(),
}));
jest.mock('@/root/src/graphql/makeQuery');

const makeHomepageQueryMock = jest.mocked(makeHomePageQueryWithDislikeRestrictions);

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <AuthContext.Provider value={mockAuthContext as AuthContextType}>
          <UserContext.Provider value={mockUserContext}>{children}</UserContext.Provider>
        </AuthContext.Provider>
      </PlatformAdapterProvider>
    </QueryClientProvider>
  );
};

const mockUserContext: UserContextType = {
  dislikes: [],
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: '12-12-2001',
      organisation: 'mock-org',
    },
    uuid: 'mock-user-uuid',
  },
  setUser: jest.fn(),
  error: undefined,
  isAgeGated: false,
};

const mockAuthContext: Partial<AuthContextType> = {
  authState: {
    idToken: '23123',
    accessToken: '111',
    refreshToken: '543',
    username: 'test',
  },
  isUserAuthenticated: as(_noop),
  isReady: true,
};

describe('useFetchHomepageData', () => {
  mockPlatformAdapter = useMockPlatformAdapter();

  describe('it calls the menus V5 API', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      mockPlatformAdapter.invokeV5Api.mockImplementation(() => {
        return Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: mockV5MenuData,
          }),
        });
      });
      makeHomepageQueryMock.mockResolvedValue({
        data: {
          banners: [
            {
              image: 'image-1',
              href: 'href-1',
              legacyCompanyId: 1,
            },
            {
              image: 'image-2',
              href: 'href-2',
              legacyCompanyId: 2,
            },
          ],
        },
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    });

    it('should return menus with IDs not set as legacy IDs when "cms-offers" experiment on', async () => {
      givenExperimentsReturn('on', 'on');

      const { result } = renderHook(() => useFetchHomepageData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.dealsOfTheWeek).toEqual([
          {
            id: 'test-offer-id-1',
            compid: 'test-company-id-1',
            offername: 'Test Offer 1',
            companyname: 'Test Company 1',
            image: 'image-1',
            logos: 'image-1',
            href: '',
          },
          {
            id: 'test-offer-id-2',
            compid: 'test-company-id-2',
            offername: 'Test Offer 2',
            companyname: 'Test Company 2',
            image: 'image-2',
            logos: 'image-2',
            href: '',
          },
        ]);
        expect(result.current.marketplaceMenus).toEqual([
          {
            name: 'Marketplace Menu 1',
            hidden: false,
            items: [
              {
                item: {
                  offerId: 'test-offer-id-1',
                  compid: 'test-company-id-1',
                  offername: 'Test Offer 1',
                  companyname: 'Test Company 1',
                  image: 'image-1',
                  logos: 'image-1',
                },
              },
              {
                item: {
                  offerId: 'test-offer-id-2',
                  compid: 'test-company-id-2',
                  offername: 'Test Offer 2',
                  companyname: 'Test Company 2',
                  image: 'image-2',
                  logos: 'image-2',
                },
              },
            ],
          },
        ]);
        expect(result.current.featuredOffers).toEqual([
          {
            id: 'test-offer-id-1',
            compid: 'test-company-id-1',
            companyname: 'Test Company 1',
            offername: 'Test Offer 1',
            image: 'image-1',
            logos: 'image-1',
          },
          {
            id: 'test-offer-id-2',
            compid: 'test-company-id-2',
            companyname: 'Test Company 2',
            offername: 'Test Offer 2',
            image: 'image-2',
            logos: 'image-2',
          },
        ]);
        expect(result.current.flexibleMenu).toEqual([
          {
            id: '100',
            title: 'Flexible Menu 1',
            imagehome: 'image-1',
            hide: false,
          },
        ]);
        expect(result.current.flexibleEventsMenu).toEqual([
          {
            id: '101',
            title: 'Flexible Event 1',
            imagehome: 'image-2',
            hide: false,
          },
        ]);
      });
    });

    it('should return menus with IDs set as legacy IDs when "cms-offers" experiment off', async () => {
      givenExperimentsReturn('on', 'off');

      const { result } = renderHook(() => useFetchHomepageData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.dealsOfTheWeek).toEqual([
          {
            id: 1,
            compid: 100,
            offername: 'Test Offer 1',
            companyname: 'Test Company 1',
            image: 'image-1',
            logos: 'image-1',
            href: '',
          },
          {
            id: 2,
            compid: 200,
            offername: 'Test Offer 2',
            companyname: 'Test Company 2',
            image: 'image-2',
            logos: 'image-2',
            href: '',
          },
        ]);
        expect(result.current.marketplaceMenus).toEqual([
          {
            name: 'Marketplace Menu 1',
            hidden: false,
            items: [
              {
                item: {
                  offerId: 1,
                  compid: 100,
                  offername: 'Test Offer 1',
                  companyname: 'Test Company 1',
                  image: 'image-1',
                  logos: 'image-1',
                },
              },
              {
                item: {
                  offerId: 2,
                  compid: 200,
                  offername: 'Test Offer 2',
                  companyname: 'Test Company 2',
                  image: 'image-2',
                  logos: 'image-2',
                },
              },
            ],
          },
        ]);
        expect(result.current.featuredOffers).toEqual([
          {
            id: 1,
            compid: 100,
            companyname: 'Test Company 1',
            offername: 'Test Offer 1',
            image: 'image-1',
            logos: 'image-1',
          },
          {
            id: 2,
            compid: 200,
            companyname: 'Test Company 2',
            offername: 'Test Offer 2',
            image: 'image-2',
            logos: 'image-2',
          },
        ]);
        expect(result.current.flexibleMenu).toEqual([
          {
            id: '100',
            title: 'Flexible Menu 1',
            imagehome: 'image-1',
            hide: false,
          },
        ]);
        expect(result.current.flexibleEventsMenu).toEqual([
          {
            id: '101',
            title: 'Flexible Event 1',
            imagehome: 'image-2',
            hide: false,
          },
        ]);
      });
    });

    it('should return banners if braze content card experiment is control', async () => {
      givenExperimentsReturn('on', 'on', 'control');

      const { result } = renderHook(() => useFetchHomepageData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.banners).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              image: 'image-1',
              href: 'href-1',
              legacyCompanyId: 1,
            }),
            expect.objectContaining({
              image: 'image-2',
              href: 'href-2',
              legacyCompanyId: 2,
            }),
          ])
        );
      });
    });

    it('should return no banners if braze content card experiment is treatment', async () => {
      givenExperimentsReturn('on', 'on', 'treatment');

      const { result } = renderHook(() => useFetchHomepageData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.banners).toEqual([]);
      });
    });

    it('should set loading error state to true if error occurs', async () => {
      givenExperimentsReturn('on', 'on');
      mockPlatformAdapter.invokeV5Api.mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useFetchHomepageData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.loadingError).toEqual(true);
      });
    });

    it.each([
      ['pending', 'done', 'done'],
      ['done', 'pending', 'done'],
      ['done', 'done', 'pending'],
    ])(
      'should not call API when all feature flags are pending',
      async (v5Search, cmsOffers, brazeContentCards) => {
        givenExperimentsStatusIs(v5Search, cmsOffers, brazeContentCards);

        renderHook(() => useFetchHomepageData(), {
          wrapper,
        });

        await waitFor(() => {
          expect(mockPlatformAdapter.invokeV5Api).not.toHaveBeenCalled();
        });
      }
    );
  });

  describe('it calls the homepage V4 query', () => {
    beforeEach(() => {
      makeHomepageQueryMock.mockResolvedValue({
        data: v4MockData,
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    });

    it('should return results', async () => {
      givenExperimentsReturn('off', 'off');

      const { result } = renderHook(() => useFetchHomepageData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.dealsOfTheWeek).toEqual([
          {
            id: 'test-offer-id-1',
            compid: 'test-company-id-1',
            offername: 'Test Offer 1',
            companyname: 'Test Company 1',
            image: 'image-1',
            logos: 'image-1',
            href: 'href',
          },
          {
            id: 'test-offer-id-2',
            compid: 'test-company-id-2',
            offername: 'Test Offer 2',
            companyname: 'Test Company 2',
            image: 'image-2',
            logos: 'image-2',
            href: 'href',
          },
        ]);
        expect(result.current.marketplaceMenus).toEqual([
          {
            name: 'Marketplace Menu 1',
            hidden: false,
            items: [
              {
                item: {
                  offerId: 'test-offer-id-1',
                  compid: 'test-company-id-1',
                  offername: 'Test Offer 1',
                  companyname: 'Test Company 1',
                  image: 'image-1',
                  logos: 'image-1',
                },
              },
              {
                item: {
                  offerId: 'test-offer-id-2',
                  compid: 'test-company-id-2',
                  offername: 'Test Offer 2',
                  companyname: 'Test Company 2',
                  image: 'image-2',
                  logos: 'image-2',
                },
              },
            ],
          },
        ]);
        expect(result.current.featuredOffers).toEqual([
          {
            id: 'test-offer-id-1',
            compid: 'test-company-id-1',
            companyname: 'Test Company 1',
            offername: 'Test Offer 1',
            image: 'image-1',
            logos: 'image-1',
          },
          {
            id: 'test-offer-id-2',
            compid: 'test-company-id-2',
            companyname: 'Test Company 2',
            offername: 'Test Offer 2',
            image: 'image-2',
            logos: 'image-2',
          },
        ]);
        expect(result.current.flexibleMenu).toEqual([
          {
            title: 'Flexible Menu 1',
            imagehome: 'image-1',
            hide: false,
          },
        ]);
      });
    });

    it('should set loading error state to true if error occurs', async () => {
      givenExperimentsReturn('off', 'on');
      makeHomepageQueryMock.mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useFetchHomepageData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.loadingError).toEqual(true);
      });
    });
  });
});

const mockV5MenuData = {
  dealsOfTheWeek: {
    id: 'deals-of-the-week',
    offers: [
      {
        offerID: 'test-offer-id-1',
        companyID: 'test-company-id-1',
        legacyOfferID: 1,
        legacyCompanyID: 100,
        offerName: 'Test Offer 1',
        companyName: 'Test Company 1',
        imageURL: 'image-1',
      },
      {
        offerID: 'test-offer-id-2',
        companyID: 'test-company-id-2',
        legacyOfferID: 2,
        legacyCompanyID: 200,
        offerName: 'Test Offer 2',
        companyName: 'Test Company 2',
        imageURL: 'image-2',
      },
    ],
  },
  marketplace: [
    {
      id: 'marketplace-menu-1',
      title: 'Marketplace Menu 1',
      description: 'Marketplace Menu 1 Description',
      hidden: false,
      offers: [
        {
          offerID: 'test-offer-id-1',
          companyID: 'test-company-id-1',
          legacyOfferID: 1,
          legacyCompanyID: 100,
          offerName: 'Test Offer 1',
          companyName: 'Test Company 1',
          imageURL: 'image-1',
        },
        {
          offerID: 'test-offer-id-2',
          companyID: 'test-company-id-2',
          legacyOfferID: 2,
          legacyCompanyID: 200,
          offerName: 'Test Offer 2',
          companyName: 'Test Company 2',
          imageURL: 'image-2',
        },
      ],
    },
  ],
  featured: {
    id: 'featured-offers-menu',
    offers: [
      {
        offerID: 'test-offer-id-1',
        companyID: 'test-company-id-1',
        legacyOfferID: 1,
        legacyCompanyID: 100,
        offerName: 'Test Offer 1',
        companyName: 'Test Company 1',
        imageURL: 'image-1',
      },
      {
        offerID: 'test-offer-id-2',
        companyID: 'test-company-id-2',
        legacyOfferID: 2,
        legacyCompanyID: 200,
        offerName: 'Test Offer 2',
        companyName: 'Test Company 2',
        imageURL: 'image-2',
      },
    ],
  },
  flexible: {
    offers: [
      {
        id: 'flexible-1',
        title: 'Ways to Save',
        menus: [
          {
            id: '100',
            title: 'Flexible Menu 1',
            imageURL: 'image-1',
          },
        ],
      },
    ],
    events: [
      {
        id: 'flexible-2',
        title: 'Flexible Events',
        menus: [
          {
            id: '101',
            title: 'Flexible Event 1',
            imageURL: 'image-2',
          },
        ],
      },
    ],
  },
};

const v4MockData = {
  banners: [
    {
      image: 'image-1',
      href: 'href-1',
      legacyCompanyId: 1,
    },
    {
      image: 'image-2',
      href: 'href-2',
      legacyCompanyId: 2,
    },
  ],
  offerMenus: {
    deals: [
      {
        id: 'test-offer-id-1',
        compid: 'test-company-id-1',
        offername: 'Test Offer 1',
        companyname: 'Test Company 1',
        image: 'image-1',
        logos: 'image-1',
        href: 'href',
      },
      {
        id: 'test-offer-id-2',
        compid: 'test-company-id-2',
        offername: 'Test Offer 2',
        companyname: 'Test Company 2',
        image: 'image-2',
        logos: 'image-2',
        href: 'href',
      },
    ],
    flexible: [
      {
        title: 'Flexible Menu 1',
        imagehome: 'image-1',
        hide: false,
      },
    ],
    features: [
      {
        id: 'test-offer-id-1',
        compid: 'test-company-id-1',
        companyname: 'Test Company 1',
        offername: 'Test Offer 1',
        image: 'image-1',
        logos: 'image-1',
      },
      {
        id: 'test-offer-id-2',
        compid: 'test-company-id-2',
        companyname: 'Test Company 2',
        offername: 'Test Offer 2',
        image: 'image-2',
        logos: 'image-2',
      },
    ],
    marketPlace: [
      {
        name: 'Marketplace Menu 1',
        hidden: false,
        items: [
          {
            item: {
              offerId: 'test-offer-id-1',
              compid: 'test-company-id-1',
              offername: 'Test Offer 1',
              companyname: 'Test Company 1',
              image: 'image-1',
              logos: 'image-1',
            },
          },
          {
            item: {
              offerId: 'test-offer-id-2',
              compid: 'test-company-id-2',
              offername: 'Test Offer 2',
              companyname: 'Test Company 2',
              image: 'image-2',
              logos: 'image-2',
            },
          },
        ],
      },
    ],
  },
};

const givenExperimentsReturn = (
  modernFlexiMenus = 'off',
  cmsOffers = 'off',
  brazeContentCards = 'control'
) => {
  (useAmplitudeExperiment as jest.Mock).mockImplementation((experimentFlag, defaultVariant) => {
    if (experimentFlag === AmplitudeExperimentFlags.MODERN_FLEXI_MENUS) {
      return {
        data: { variantName: modernFlexiMenus },
        status: 'done',
      };
    }

    if (experimentFlag === 'cms-offers') {
      return {
        data: { variantName: cmsOffers },
        status: 'done',
      };
    }

    if (experimentFlag === AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED) {
      return {
        data: { variantName: brazeContentCards },
        status: 'done',
      };
    }

    return {
      data: { variantName: defaultVariant },
      status: 'done',
    };
  });
};

const givenExperimentsStatusIs = (
  modernFlexiMenus = 'pending',
  cmsOffers = 'pending',
  brazeContentCards = 'pending'
) => {
  (useAmplitudeExperiment as jest.Mock).mockImplementation((experimentFlag, defaultVariant) => {
    if (experimentFlag === AmplitudeExperimentFlags.MODERN_FLEXI_MENUS) {
      return { status: modernFlexiMenus };
    }

    if (experimentFlag === AmplitudeExperimentFlags.CMS_OFFERS) {
      return { status: cmsOffers };
    }

    if (experimentFlag === AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED) {
      return { status: brazeContentCards };
    }

    return { data: { variantName: defaultVariant } };
  });
};
