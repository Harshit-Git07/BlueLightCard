import '@testing-library/jest-dom';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextRouter, useRouter } from 'next/router';
import {
  OfferDetailsContext,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
  SharedUIConfigProvider,
  SharedUIConfig,
  flexibleOfferMock,
  AmplitudeEvents,
} from '@bluelightcard/shared-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FlexibleOffersPage from '@/pages/flexible-offers';
import { BRAND, CDN_URL } from '@/globals';
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

const mockSharedUIConfig: SharedUIConfig = {
  globalConfig: {
    cdnUrl: CDN_URL,
    brand: BRAND,
  },
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
    (useFlexibleOffersData as jest.Mock).mockReturnValue({ data: flexibleOfferMock });
  });

  const wrapper: RenderOptions['wrapper'] = ({ children }) => {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <SharedUIConfigProvider value={mockSharedUIConfig}>
            <RouterContext.Provider value={mockRouter as NextRouter}>
              <OfferDetailsContext.Provider value={{ viewOffer: viewOfferMock }}>
                {children}
              </OfferDetailsContext.Provider>
            </RouterContext.Provider>
          </SharedUIConfigProvider>
        </PlatformAdapterProvider>
      </QueryClientProvider>
    );
  };

  const renderComponent = () => render(<FlexibleOffersPage />, { wrapper });

  it('does not render flexible offers content initially', () => {
    expect(screen.queryByText('Offer Boosts for you')).not.toBeInTheDocument();
  });

  it('renders flexible offers content once data is loaded', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Offer Boosts for you')).toBeInTheDocument();
      expect(
        screen.getByText(
          'This week, we have partnered with some of our partners to reward you with even bigger discounts. Why not take a look at these Offer Boosts…',
        ),
      ).toBeInTheDocument();
      expect(screen.getByAltText('Banner image for Offer Boosts for you')).toHaveAttribute(
        'src',
        'https://cdn.bluelightcard.co.uk/flexible/home/bbr-offer-boosts-week6-flexi.jpg',
      );
    });
  });

  it('renders error fallback if there is an error', async () => {
    (useFlexibleOffersData as jest.Mock).mockImplementation(() => {
      throw new Error('Error fetching offers');
    });

    renderComponent();

    const errorMessage = await screen.findByText('Oops! Something went wrong.');
    const tryAgainButton = await screen.findByRole('button', {
      name: /Please try again/i,
    });
    expect(tryAgainButton).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
  });

  describe('Amplitude events', () => {
    renderComponent();

    it('logs an analytics event when an offer is viewed', async () => {
      expect(mockPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith(
        AmplitudeEvents.FLEXIBLE_OFFERS.PAGE_VIEWED,
        {
          flexi_menu_id: flexibleOfferMock.id,
          flexi_menu_title: flexibleOfferMock.title,
          brand: BRAND,
        },
      );
    });

    it('logs an analytics event when an offer is clicked', async () => {
      renderComponent();

      const mockOfferData = flexibleOfferMock.offers[0];
      const offers = screen.getAllByText('Deal of the Week 1');
      const targetOffer = offers[0];

      await userEvent.click(targetOffer);
      expect(mockPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith(
        AmplitudeEvents.FLEXIBLE_OFFERS.CARD_CLICKED,
        {
          flexi_menu_id: flexibleOfferMock.id,
          flexi_menu_title: flexibleOfferMock.title,
          brand: BRAND,
          company_name: mockOfferData.companyName,
          company_id: mockOfferData.companyID,
          offer_name: mockOfferData.offerName,
          offer_id: mockOfferData.offerID,
        },
      );
    });
  });
});
