import '@testing-library/jest-dom';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import {
  OfferDetailsContext,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FlexibleOffersPage from '@/pages/flexible-offers';
import useFlexibleOffersData from '@/hooks/useFlexibleOffersData';
import { RouterContext } from 'next/dist/shared/lib/router-context';

jest.mock('@/hooks/useFlexibleOffersData');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => {
  return function Image(props: any) {
    return <img {...props} />;
  };
});

const viewOfferMock = jest.fn();

const mockFlexibleOffersData = {
  title: 'Exclusive Offers',
  description: 'Special deals for you!',
  imageURL: 'https://example.com/banner.jpg',
  offers: [
    { offerID: '1', companyID: '100', companyName: 'Brand One' },
    { offerID: '2', companyID: '200', companyName: 'Brand Two' },
  ],
};

describe('Flexible Offers Page', () => {
  const mockPlatformAdapter = {
    ...useMockPlatformAdapter(),
  };
  const mockRouter: Partial<NextRouter> = {
    push: jest.fn(),
    isReady: true,
    query: { id: 'test-flexi-menu-id' },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useFlexibleOffersData as jest.Mock).mockReturnValue({ data: mockFlexibleOffersData });
  });

  const wrapper: RenderOptions['wrapper'] = ({ children }) => {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <OfferDetailsContext.Provider value={{ viewOffer: viewOfferMock }}>
              {children}
            </OfferDetailsContext.Provider>
          </RouterContext.Provider>
        </PlatformAdapterProvider>
      </QueryClientProvider>
    );
  };

  const renderComponent = () => render(<FlexibleOffersPage />, { wrapper });

  it('does not render flexible offers content initially', () => {
    expect(screen.queryByText('Exclusive Offers')).not.toBeInTheDocument();
  });

  it('renders flexible offers content once data is loaded', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Exclusive Offers')).toBeInTheDocument();
      expect(screen.getByText('Special deals for you!')).toBeInTheDocument();
      expect(screen.getByAltText('Banner image for Exclusive Offers')).toHaveAttribute(
        'src',
        'https://example.com/banner.jpg',
      );
    });
  });

  it('renders error fallback if there is an error', async () => {
    (useFlexibleOffersData as jest.Mock).mockImplementation(() => {
      throw new Error('Error fetching offers');
    });

    renderComponent();

    const errorMessage = await screen.findByText('Something went wrong');
    expect(errorMessage).toBeInTheDocument();
  });
});
