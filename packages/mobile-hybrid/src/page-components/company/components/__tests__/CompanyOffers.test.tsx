import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, waitFor, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { useMedia } from 'react-use';

import { useCmsEnabled } from '@/hooks/useCmsEnabled';

import { selectedFilter } from '../../atoms';
import CompanyOffers from '../CompanyOffers';
import { FiltersType } from '../../types';
import {
  OfferDetailsContext,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui';
import { createFactoryMethod } from '@/utils/createFactoryMethod';
import { Offer } from '@blc/offers-cms/api/schema';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';

jest.mock('@/hooks/useCmsEnabled');
jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));

const mockUseMedia = jest.mocked(useMedia);
const mockUseCmsEnabled = jest.mocked(useCmsEnabled);
mockUseCmsEnabled.mockReturnValue(true);
const viewOfferMock = jest.fn();

const companyId = '123';

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

describe('Company Offers Component', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();
  const createWrapper = (initialFilter: FiltersType): RenderOptions['wrapper'] =>
    function Wrapper({ children }) {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <JotaiTestProvider initialValues={[[selectedFilter, initialFilter]]}>
              <OfferDetailsContext.Provider value={{ viewOffer: viewOfferMock }}>
                <Suspense fallback="loading">{children}</Suspense>
              </OfferDetailsContext.Provider>
            </JotaiTestProvider>
          </PlatformAdapterProvider>
        </QueryClientProvider>
      );
    };

  const renderComponent = (companyId: string, initialFilter: FiltersType) =>
    render(<CompanyOffers companyId={companyId} />, { wrapper: createWrapper(initialFilter) });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([[true], [false]])(
    'should render No offers have been found when isMobile is %s',
    async (isMobile) => {
      mockUseMedia.mockReturnValue(isMobile);

      mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
        status: 200,
        data: JSON.stringify({ name: 'Company Name', id: companyId }),
      });
      mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
        status: 200,
        data: JSON.stringify([]),
      });

      renderComponent(companyId, 'All');
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /no offers have been found\./i })).toBeTruthy();
      });
    },
  );

  it.each([[true], [false]])('should render offers when isMobile is %s', async (isMobile) => {
    mockUseMedia.mockReturnValue(isMobile);

    const offers = [
      createOffer({ id: '1', name: 'Offer 1', image: 'offer1.jpg', type: 'in-store' }),
      createOffer({ id: '2', name: 'Offer 2', image: 'offer2.jpg', type: 'local' }),
    ];

    mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
      status: 200,
      data: JSON.stringify({ name: 'Company Name', id: companyId }),
    });
    mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
      status: 200,
      data: JSON.stringify(offers),
    });

    const { queryByText, getByRole, container } = renderComponent(companyId, 'All');
    await waitFor(() => {
      expect(queryByText(/no offers have been found\./i)).toBeFalsy();
      expect(getByRole('img', { name: /offer 1 offer/i })).toBeTruthy();
      expect(getByRole('img', { name: /offer 2 offer/i })).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
});
