import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, within, RenderResult, RenderOptions } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OfferDetailsContext, flexibleOfferMock } from '@bluelightcard/shared-ui';
import * as stories from '../../page-stories/flexible-offers.stories';

const viewOfferMock = jest.fn();

expect.extend(toHaveNoViolations);

const { Error, Loading, Success } = composeStories(stories);

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
  query: { id: 'test-flexi-menu-id' },
};

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
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
      const errorMessage = await within(container).findByText('Something went wrong');
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
    let container: RenderResult['container'];

    beforeEach(() => {
      const result = render(<Success />, { wrapper });
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

    test('and opens the offer sheet when an offer is clicked', async () => {
      const offer = await within(container).findByLabelText(
        `${flexibleOfferMock.offers[0].companyName}: ${flexibleOfferMock.offers[0].offerName}`
      );
      await userEvent.click(offer);

      expect(viewOfferMock).toHaveBeenCalled();
    });

    test('and has no accessibility violations', async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
