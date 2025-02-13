import '@testing-library/jest-dom';
import { renderHook, RenderOptions, waitFor } from '@testing-library/react';
import { AmplitudeExperimentFlags } from '../../utils/amplitude/AmplitudeExperimentFlags';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import useFetchCompaniesOrCategories from '@/hooks/useFetchCompaniesOrCategories';
import { UserContextType } from '@/context/User/UserContext';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { makeNavbarQueryWithDislikeRestrictions } from '@/root/src/graphql/makeQuery';
import { NetworkStatus } from '@apollo/client';
import { NextRouter } from 'next/router';
import { redirectToLogin } from '@/hoc/requireAuth';
import * as excludeEventCategoryModule from '../../../../../shared-ui/src/utils/excludeEventCategory';

let mockPlatformAdapter: ReturnType<typeof useMockPlatformAdapter>;

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@/context/AmplitudeExperiment', () => ({
  ...jest.requireActual('@/context/AmplitudeExperiment'),
  useAmplitudeExperiment: jest.fn(),
}));
jest.mock('@/root/src/graphql/makeQuery');
jest.mock('@/hoc/requireAuth');

jest.mock('../../../../../shared-ui/src/utils/excludeEventCategory', () => ({
  excludeEventCategory: jest.fn().mockReturnValue([
    {
      id: '1',
      name: 'Test Category 1',
    },
    {
      id: '2',
      name: 'Test Category 2',
    },
  ]),
}));

const makeNavbarQueryMock = jest.mocked(makeNavbarQueryWithDislikeRestrictions);
const redirectToLoginMock = jest.mocked(redirectToLogin);

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>{children}</PlatformAdapterProvider>
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

describe('useFetchCompaniesOrCategories', () => {
  mockPlatformAdapter = useMockPlatformAdapter();

  describe('it calls the companies or categories V5 API', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockPlatformAdapter.invokeV5Api.mockImplementation((path: string) => {
        if (path.includes('/companies')) {
          return Promise.resolve({
            status: 200,
            data: JSON.stringify({
              data: [
                {
                  companyID: 'test-company-id-1',
                  companyName: 'Test Company 1',
                  legacyCompanyID: 1234,
                },
                {
                  companyID: 'test-company-id-2',
                  companyName: 'Test Company 2',
                  legacyCompanyID: 5678,
                },
              ],
            }),
          });
        } else if (path.includes('/categories')) {
          return Promise.resolve({
            status: 200,
            data: JSON.stringify({
              data: [
                {
                  id: '1',
                  name: 'Test Category 1',
                },
                {
                  id: '2',
                  name: 'Test Category 2',
                },
              ],
            }),
          });
        } else {
          return Promise.reject(new Error('Invalid path provided'));
        }
      });
    });

    it('should return results with company IDs not set as legacy IDs when "cms-offers" experiment on', async () => {
      givenExperimentsReturn('on', 'on');

      const { result } = renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.companies).toEqual([
          { id: 'test-company-id-1', legacyId: '1234', name: 'Test Company 1' },
          { id: 'test-company-id-2', legacyId: '5678', name: 'Test Company 2' },
        ]);
        expect(result.current.categories).toEqual([
          {
            id: '1',
            name: 'Test Category 1',
          },
          {
            id: '2',
            name: 'Test Category 2',
          },
        ]);
      });
    });

    it('should return results with company IDs set as legacy IDs when "cms-offers" experiment off', async () => {
      givenExperimentsReturn('on', 'off');

      const { result } = renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.companies).toEqual([
          { id: '1234', legacyId: '1234', name: 'Test Company 1' },
          { id: '5678', legacyId: '5678', name: 'Test Company 2' },
        ]);
      });
    });

    it('should return categories', async () => {
      givenExperimentsReturn('on', 'on');

      const { result } = renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.categories).toEqual([
          {
            id: '1',
            name: 'Test Category 1',
          },
          {
            id: '2',
            name: 'Test Category 2',
          },
        ]);
      });
    });

    it('should redirect to login on error', async () => {
      mockPlatformAdapter.invokeV5Api.mockImplementation(() => {
        throw new Error('Error');
      });
      givenExperimentsReturn('on', 'on');

      renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(redirectToLoginMock).toHaveBeenCalled();
      });
    });

    it('should not call API when both feature flags are pending', async () => {
      givenExperimentsStatusIs('pending', 'pending');

      renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).not.toHaveBeenCalled();
      });
    });

    it('should not call API when v5_search feature flag is pending', async () => {
      givenExperimentsStatusIs('pending', 'done');

      renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).not.toHaveBeenCalled();
      });
    });

    it('should not call API when cms-offers feature flag is pending', async () => {
      givenExperimentsStatusIs('done', 'pending');

      renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).not.toHaveBeenCalled();
      });
    });

    it.each([
      [
        'on',
        true,
        [
          { id: '1', name: 'Test Category 1' },
          { id: '2', name: 'Test Category 2' },
        ],
      ],
      [
        'someOtherValue',
        false,
        [
          { id: '1', name: 'Test Category 1' },
          { id: '2', name: 'Test Category 2' },
        ],
      ],
    ])(
      'should transform categories for view when feature flag "ENABLE_EVENTS_AS_OFFERS" is: %s',
      async (flagValue, expectedShouldIncludeEvents, expectedTransformedCategories) => {
        const mockexcludeEventCategoryModule = excludeEventCategoryModule.excludeEventCategory;

        givenExperimentsReturn('on', 'on');
        mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue(flagValue);

        const { result } = renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
          wrapper,
        });

        await waitFor(() => {
          expect(mockexcludeEventCategoryModule).toHaveBeenCalledWith(
            [
              { id: '1', name: 'Test Category 1' },
              { id: '2', name: 'Test Category 2' },
            ],
            expectedShouldIncludeEvents
          );

          expect(result.current.categories).toEqual(expectedTransformedCategories);
        });
      }
    );
  });

  describe('it calls the "companiesCategories" V4 query', () => {
    beforeEach(() => {
      makeNavbarQueryMock.mockResolvedValue({
        data: {
          response: {
            categories: [
              {
                id: '1',
                name: 'Test Category 1',
              },
              {
                id: '2',
                name: 'Test Category 2',
              },
            ],
            companies: [
              {
                id: '1234',
                name: 'Test Company 1',
              },
              {
                id: '5678',
                name: 'Test Company 2',
              },
            ],
          },
        },
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    });

    it('should return results', async () => {
      givenExperimentsReturn('off', 'off');

      const { result } = renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.companies).toEqual([
          { id: '1234', name: 'Test Company 1' },
          { id: '5678', name: 'Test Company 2' },
        ]);
        expect(result.current.categories).toEqual([
          {
            id: '1',
            name: 'Test Category 1',
          },
          {
            id: '2',
            name: 'Test Category 2',
          },
        ]);
      });
    });

    it('should redirect to login on error', async () => {
      makeNavbarQueryMock.mockRejectedValue(new Error('Error'));
      givenExperimentsReturn('off', 'off');

      renderHook(() => useFetchCompaniesOrCategories(mockUserContext), {
        wrapper,
      });

      await waitFor(() => {
        expect(redirectToLoginMock).toHaveBeenCalled();
      });
    });
  });
});

const givenExperimentsReturn = (modernCategories = 'control', cmsOffers = 'off') => {
  (useAmplitudeExperiment as jest.Mock).mockImplementation((experimentFlag, defaultVariant) => {
    if (experimentFlag === AmplitudeExperimentFlags.MODERN_CATEGORIES) {
      return { data: { variantName: modernCategories } };
    }

    if (experimentFlag === 'cms-offers') {
      return { data: { variantName: cmsOffers } };
    }

    return { data: { variantName: defaultVariant } };
  });
};

const givenExperimentsStatusIs = (modernCategories = 'pending', cmsOffers = 'pending') => {
  (useAmplitudeExperiment as jest.Mock).mockImplementation((experimentFlag, defaultVariant) => {
    if (experimentFlag === AmplitudeExperimentFlags.MODERN_CATEGORIES) {
      return { status: modernCategories };
    }

    if (experimentFlag === 'cms-offers') {
      return { status: cmsOffers };
    }

    return { data: { variantName: defaultVariant } };
  });
};
