import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, within, RenderResult, RenderOptions } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AmplitudeEvents,
  OfferDetailsContext,
  flexibleOfferMock,
  storybookPlatformAdapter,
} from '@bluelightcard/shared-ui';
import * as stories from '../../page-stories/flexible-offers.stories';

const viewOfferMock = jest.fn();

expect.extend(toHaveNoViolations);

const { Error, Loading, Success, WithCmsOffers } = composeStories(stories);

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
  query: { id: 'test-flexi-menu-id' },
};

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
  storybookPlatformAdapter.logAnalyticsEvent = jest.fn();

  return (
    <QueryClientProvider client={new QueryClient()}>
      <RouterContext.Provider value={mockRouter as NextRouter}>
        <OfferDetailsContext.Provider value={{ viewOffer: viewOfferMock }}>
          {children}
        </OfferDetailsContext.Provider>
      </RouterContext.Provider>
    </QueryClientProvider>
  );
};

describe('Flexible Offers page', () => {
  describe('it renders an error state', () => {
    let container: RenderResult['container'];

    beforeEach(() => {
      const result = render(<Error />, { wrapper });
      container = result.container;
    });

    test('and renders an error message', async () => {
      const errorMessage = await within(container).findByText('Oops! Something went wrong.');
      expect(errorMessage).toBeInTheDocument();
    });

    test('and has no accessibility violations', async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('it renders a loading state', () => {
    let container: RenderResult['container'];

    beforeEach(() => {
      const result = render(<Loading />, { wrapper });
      container = result.container;
    });

    test('and renders placeholders', async () => {
      const [placeholder] = await within(container).findAllByTitle('Loading...');
      expect(placeholder).toBeInTheDocument();
    });

    test('and has no accessibility violations', async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('it renders a success state', () => {
    let result: RenderResult;
    let container: RenderResult['container'];

    beforeEach(() => {
      result = render(<Success />, { wrapper });
      container = result.container;
    });

    test('and renders the flexible offer image', async () => {
      const image = await within(container).findByRole('img', {
        name: `Banner image for ${flexibleOfferMock.title}`,
      });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining(flexibleOfferMock.imageURL));
    });

    test('and renders the flexible offer title', async () => {
      const title = await within(container).findByText(flexibleOfferMock.title);
      expect(title).toBeInTheDocument();
    });

    test('and renders the flexible offer description', async () => {
      const description = await within(container).findByText(flexibleOfferMock.description);
      expect(description).toBeInTheDocument();
    });

    test('and renders the offers', async () => {
      const offerName = await within(container).findByLabelText(
        `${flexibleOfferMock.offers[0].companyName}: ${flexibleOfferMock.offers[0].offerName}`
      );
      expect(offerName).toBeInTheDocument();
    });

    test('and opens the offer sheet with legacy IDs when an offer is clicked', async () => {
      const [mockedOffer] = flexibleOfferMock.offers;
      const offer = await within(container).findByLabelText(
        `${flexibleOfferMock.offers[0].companyName}: ${mockedOffer.offerName}`
      );
      await userEvent.click(offer);

      expect(viewOfferMock).toHaveBeenCalledWith({
        offerId: mockedOffer.legacyOfferID,
        companyId: mockedOffer.legacyCompanyID,
        companyName: mockedOffer.companyName,
        platform: expect.any(String),
      });
    });

    test('and logs an analytics event with when the page is viewed', async () => {
      await within(container).findByText(flexibleOfferMock.title);

      expect(storybookPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith(
        AmplitudeEvents.FLEXIBLE_OFFERS.PAGE_VIEWED,
        {
          flexi_menu_id: flexibleOfferMock.id,
          flexi_menu_title: flexibleOfferMock.title,
          brand: 'blc-uk',
        }
      );
    });

    test('and does not log an analytics event on re-renders', async () => {
      await within(container).findByText(flexibleOfferMock.title);
      result.rerender(<Success />);

      expect(storybookPlatformAdapter.logAnalyticsEvent).not.toHaveBeenCalled();
    });

    test('and logs an analytics event with legacy IDs when an offer is clicked', async () => {
      const offer = await within(container).findByLabelText(
        `${flexibleOfferMock.offers[0].companyName}: ${flexibleOfferMock.offers[0].offerName}`
      );
      await userEvent.click(offer);

      const mockOfferData = flexibleOfferMock.offers[0];

      expect(storybookPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith(
        AmplitudeEvents.FLEXIBLE_OFFERS.CARD_CLICKED,
        {
          flexi_menu_id: flexibleOfferMock.id,
          flexi_menu_title: flexibleOfferMock.title,
          brand: 'blc-uk',
          company_name: mockOfferData.companyName,
          company_id: mockOfferData.legacyCompanyID,
          offer_name: mockOfferData.offerName,
          offer_id: mockOfferData.legacyOfferID,
        }
      );
    });

    test('and has no accessibility violations', async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('it renders with the CMS Offers flag enabled', () => {
    let result: RenderResult;
    let container: RenderResult['container'];

    beforeEach(() => {
      storybookPlatformAdapter.getAmplitudeFeatureFlag = () => 'on';
      result = render(<WithCmsOffers />, { wrapper });
      container = result.container;
    });

    test('and opens the offer sheet with modern IDs when an offer is clicked', async () => {
      const [mockedOffer] = flexibleOfferMock.offers;
      const offer = await within(container).findByLabelText(
        `${flexibleOfferMock.offers[0].companyName}: ${mockedOffer.offerName}`
      );
      await userEvent.click(offer);

      expect(viewOfferMock).toHaveBeenCalledWith({
        offerId: mockedOffer.offerID,
        companyId: mockedOffer.companyID,
        companyName: mockedOffer.companyName,
        platform: expect.any(String),
      });
    });

    test('and logs an analytics event with modern IDs when an offer is clicked', async () => {
      const offer = await within(container).findByLabelText(
        `${flexibleOfferMock.offers[0].companyName}: ${flexibleOfferMock.offers[0].offerName}`
      );
      await userEvent.click(offer);

      const mockOfferData = flexibleOfferMock.offers[0];

      expect(storybookPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith(
        AmplitudeEvents.FLEXIBLE_OFFERS.CARD_CLICKED,
        {
          flexi_menu_id: flexibleOfferMock.id,
          flexi_menu_title: flexibleOfferMock.title,
          brand: 'blc-uk',
          company_name: mockOfferData.companyName,
          company_id: mockOfferData.companyID,
          offer_name: mockOfferData.offerName,
          offer_id: mockOfferData.offerID,
        }
      );
    });
  });
});
