import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, within, RenderResult, RenderOptions } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AmplitudeEvents,
  Offer,
  OfferDetailsContext,
  categoryMock,
  storybookPlatformAdapter,
} from '@bluelightcard/shared-ui';
import * as stories from '../../page-stories/category.stories';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';

/**
 * We should really mock the whole globals module but doing so caused unexpected
 * problems ... probably other unmocked dependencies of `category.tsx` are relying
 * on the globals.
 */
jest.mock('../../globals', () => {
  const originalGlobalsModule = jest.requireActual('../../globals');
  return {
    ...originalGlobalsModule,
    BRAND: 'fakeBrand',
  };
});

const viewOfferMock = jest.fn();

expect.extend(toHaveNoViolations);

const { Error, Loading, Success, WithPagination } = composeStories(stories);

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
  query: { id: 'category1' },
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

const givenMockedCategoryOffer = () => {
  const [mockedCategoryOffer] = categoryMock.data;
  return mockedCategoryOffer;
};

const givenCategoryTitleRenders = async (container: RenderResult['container']) => {
  const title = await within(container).findByText(categoryMock.name);
  expect(title).toBeInTheDocument();

  return title;
};

const givenCategoryOfferRenders = async (
  container: RenderResult['container'],
  mockedOffer: Offer,
) => {
  const offer = await within(container).findByLabelText(
    `${mockedOffer.companyName}: ${mockedOffer.offerName}`,
  );
  expect(offer).toBeInTheDocument();

  return offer;
};

const whenOfferIsClicked = async (offer: HTMLElement) => {
  await userEvent.click(offer);
};

const thenOfferSheetIsOpened = (args: any = {}) => {
  expect(viewOfferMock).toHaveBeenCalledWith({
    platform: expect.any(String),
    ...args,
  });
};

const thenAnalyticsEventIsLogged = (event: string, args: any = {}) => {
  expect(storybookPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith(event, {
    brand: 'fakeBrand',
    ...args,
  });
};

const thenAxeHasNoViolations = async (container: RenderResult['container']) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

describe('Category page', () => {
  describe('it renders: Error', () => {
    let container: RenderResult['container'];

    const givenErrorMessageRenders = async () => {
      const errorMessage = await within(container).findByText('Oops! Something went wrong.');
      expect(errorMessage).toBeInTheDocument();

      return errorMessage;
    };

    beforeEach(() => {
      const result = render(<Error />, { wrapper });
      container = result.container;
    });

    test('and renders an error message', async () => {
      await givenErrorMessageRenders();
    });

    test('and has no accessibility violations', async () => {
      await givenErrorMessageRenders();
      await thenAxeHasNoViolations(container);
    });
  });

  describe('it renders: Loading', () => {
    let container: RenderResult['container'];

    const givenPlaceholderRenders = async () => {
      const [placeholder] = await within(container).findAllByTitle('Loading...');
      expect(placeholder).toBeInTheDocument();

      return placeholder;
    };

    beforeEach(() => {
      const result = render(<Loading />, { wrapper });
      container = result.container;
    });

    test('and renders placeholders', async () => {
      await givenPlaceholderRenders();
    });

    test('and has no accessibility violations', async () => {
      await givenPlaceholderRenders();
      await thenAxeHasNoViolations(container);
    });
  });

  describe('it renders: Success', () => {
    let result: RenderResult;
    let container: RenderResult['container'];

    beforeEach(() => {
      result = render(<Success />, { wrapper });
      container = result.container;
    });

    test('and renders the category name', async () => {
      await givenCategoryTitleRenders(container);
    });

    test('and renders the category offers', async () => {
      const mockedCategoryOffer = givenMockedCategoryOffer();
      await givenCategoryOfferRenders(container, mockedCategoryOffer);
    });

    test('and opens the offer sheet when an offer is clicked', async () => {
      const mockedCategoryOffer = givenMockedCategoryOffer();
      const offer = await givenCategoryOfferRenders(container, mockedCategoryOffer);
      await whenOfferIsClicked(offer);

      thenOfferSheetIsOpened({
        offerId: mockedCategoryOffer.offerID,
        companyId: mockedCategoryOffer.companyID,
        companyName: mockedCategoryOffer.companyName,
      });
    });

    test('and logs an analytics event with when the page is viewed', async () => {
      await givenCategoryTitleRenders(container);
      thenAnalyticsEventIsLogged(AmplitudeEvents.CATEGORY.PAGE_VIEWED, {
        category_id: categoryMock.id,
        category_title: categoryMock.name,
      });
    });

    test('and does not log an analytics event on re-renders', async () => {
      await givenCategoryTitleRenders(container);
      result.rerender(<Success />);

      expect(storybookPlatformAdapter.logAnalyticsEvent).not.toHaveBeenCalled();
    });

    test('and logs an analytics event when an offer is clicked', async () => {
      const mockedCategoryOffer = givenMockedCategoryOffer();
      const offer = await givenCategoryOfferRenders(container, mockedCategoryOffer);
      await whenOfferIsClicked(offer);

      thenAnalyticsEventIsLogged(AmplitudeEvents.CATEGORY.CARD_CLICKED, {
        category_id: categoryMock.id,
        category_title: categoryMock.name,
        company_name: mockedCategoryOffer.companyName,
        company_id: mockedCategoryOffer.companyID,
        offer_name: mockedCategoryOffer.offerName,
        offer_id: mockedCategoryOffer.offerID,
      });
    });

    test('and has no accessibility violations', async () => {
      await givenCategoryTitleRenders(container);
      await thenAxeHasNoViolations(container);
    });
  });

  describe('it renders: With Pagination', () => {
    let result: RenderResult;
    let container: RenderResult['container'];

    const givenPageButtonRenders = async () => {
      const pageButton = await within(container).findByRole('button', { name: 'Load more' });
      expect(pageButton).toBeInTheDocument();

      return pageButton;
    };

    const givenPageButtonIsHidden = () => {
      const pageButton = within(container).queryByRole('button', { name: 'Load more' });
      expect(pageButton).not.toBeInTheDocument();
    };

    const whenPageButtonIsClicked = async (button: HTMLElement) => {
      await userEvent.click(button);
    };

    const thenNumberedResultRenders = async (resultNumber: number) => {
      const numberedResult = await within(container).findByText(`Deal of the Week ${resultNumber}`);
      expect(numberedResult).toBeInTheDocument();

      return numberedResult;
    };

    beforeEach(() => {
      mockRouter.query = { id: 'test-category-id-paginated' };
      result = render(<WithPagination />, { wrapper });
      container = result.container;
    });

    describe('and renders the last page', () => {
      test('and shows the last page of results when clicked', async () => {
        const pageButton = await givenPageButtonRenders();
        await whenPageButtonIsClicked(pageButton);
        await thenNumberedResultRenders(10);
        await thenNumberedResultRenders(20);
        givenPageButtonIsHidden();
      });
    });
  });
});
