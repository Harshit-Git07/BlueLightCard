import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { useMedia } from 'react-use';

import { Offer } from '@blc/offers-cms/api/schema';
import { useCmsEnabled } from '@/hooks/useCmsEnabled';
import { spinner } from '@/modules/Spinner/store';
import { selectedFilter } from '@/page-components/company/atoms';
import { FiltersType } from '@/page-components/company/types';
import { createFactoryMethod } from '@/utils/createFactoryMethod';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import {
  useMockPlatformAdapter,
  PlatformAdapterProvider,
} from '../../../../shared-ui/src/adapters';
import Company from '@/pages/company';
import { SharedUIConfigProvider, type SharedUIConfig } from '@bluelightcard/shared-ui';
import { BRAND, CDN_URL } from '@/globals';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import InvokeNativeAnalytics from '@/invoke/analytics';

jest.mock('@/hooks/useCmsEnabled');
jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const mockUseCmsEnabled = jest.mocked(useCmsEnabled);
mockUseCmsEnabled.mockReturnValue(true);
let mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  query: {},
};

const companyName = 'Company Name';
const companyId = '123';
const mockSharedUIConfig: SharedUIConfig = {
  globalConfig: {
    cdnUrl: CDN_URL,
    brand: BRAND,
  },
};

const createOffer = createFactoryMethod<Offer>({
  companyId,
  description: null,
  expires: '2022-01-01T00:00:00',
  id: '1',
  image: 'offer1.jpg',
  name: 'Offer 1',
  type: 'online',
  termsAndConditions: null,
});

const createResponse = <T,>(body: T) =>
  Promise.resolve({
    status: 200,
    data: JSON.stringify(body),
  });

const givenCidQueryParamIs = (queryParam?: string) => {
  if (queryParam) {
    mockRouter = {
      ...mockRouter,
      query: {
        cid: queryParam,
      },
    };
  } else {
    mockRouter = {
      query: {},
    };
  }
};
describe('Company Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockApiImplementation = (companiesResponse: unknown, companyOffersResponse: unknown) =>
    mockPlatformAdapter.invokeV5Api.mockImplementation((path: string) => {
      if (path.endsWith(`/companies/${companyId}`)) {
        return createResponse(companiesResponse);
      }
      if (path.endsWith(`/companies/${companyId}/offers`)) {
        return createResponse(companyOffersResponse);
      }
      return Promise.reject(new Error('Invalid path'));
    });

  const createWrapper = (initialFilter: FiltersType): RenderOptions['wrapper'] =>
    function Wrapper({ children }) {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <SharedUIConfigProvider value={mockSharedUIConfig}>
              <RouterContext.Provider value={mockRouter as NextRouter}>
                <JotaiTestProvider
                  initialValues={[
                    [selectedFilter, initialFilter],
                    [spinner, true],
                  ]}
                >
                  {children}
                </JotaiTestProvider>
              </RouterContext.Provider>
            </SharedUIConfigProvider>
          </PlatformAdapterProvider>
        </QueryClientProvider>
      );
    };
  const renderComponent = (initialFilter: FiltersType) =>
    render(<Company />, { wrapper: createWrapper(initialFilter) });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log analytics event for page view', async () => {
    givenCidQueryParamIs(companyId);
    const analyticsMock = jest
      .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    mockApiImplementation({ name: companyName, id: companyId }, [
      createOffer({ id: '1' }),
      createOffer({ id: '2' }),
    ]);

    await act(async () => {
      renderComponent('All');
    });

    expect(analyticsMock).toHaveBeenCalledWith({
      event: AmplitudeEvents.COMPANYPAGE_VIEWED,
      parameters: {
        company_id: companyId,
        company_name: companyName,
        origin: 'mobile-hybrid',
      },
    });
  });

  it('should render "No offers have been found" message if no offers are returned', async () => {
    givenCidQueryParamIs(companyId);

    mockApiImplementation({ name: companyName, id: companyId }, []);

    renderComponent('All');
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /no offers have been found\./i })).toBeTruthy();
    });
  });

  it('should set spinner to false once company name is loaded', async () => {
    givenCidQueryParamIs(companyId);

    mockApiImplementation({ name: companyName, id: companyId }, [createOffer({ id: '1' })]);

    renderComponent('All');
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });
});
