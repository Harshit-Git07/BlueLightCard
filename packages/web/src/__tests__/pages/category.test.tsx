import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, within, RenderResult, RenderOptions } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { NextRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AmplitudeEvents,
  Offer,
  OfferDetailsContext,
  allMenusMock,
  categoryMock,
  storybookPlatformAdapter,
} from '@bluelightcard/shared-ui';
import * as stories from '../../page-stories/category.stories';

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: PropsWithChildren) => <div data-testid="swiper-testid">{children}</div>,
  SwiperSlide: ({ children }: PropsWithChildren) => (
    <div data-testid="swiper-slide-testid">{children}</div>
  ),
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const viewOfferMock = jest.fn();

expect.extend(toHaveNoViolations);

const { Error, Loading, Success, WithCmsOffers, WithPagination } = composeStories(stories);

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
  query: { id: 'test-category-id' },
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

const givenMockedFeaturedOffer = () => {
  const [mockedOffer] = allMenusMock.featured?.offers as Offer[];
  return mockedOffer;
};

const givenCategoryTitleRenders = async (container: RenderResult['container']) => {
  const title = await within(container).findByText(categoryMock.name);
  expect(title).toBeInTheDocument();

  return title;
};

const givenCategoryOfferRenders = async (
  container: RenderResult['container'],
  mockedOffer: Offer
) => {
  const offer = await within(container).findByLabelText(
    `${mockedOffer.companyName}: ${mockedOffer.offerName}`
  );
  expect(offer).toBeInTheDocument();

  return offer;
};

const givenFeaturedOffersTitleRenders = async (container: RenderResult['container']) => {
  const featuredOffersTitle = await within(container).findByText('Featured Offers');
  expect(featuredOffersTitle).toBeInTheDocument();

  return featuredOffersTitle;
};

const givenFeaturedOfferRenders = async (
  container: RenderResult['container'],
  mockedOffer: Offer
) => {
  const featuredOffer = await within(container).findByText(mockedOffer.offerName);
  expect(featuredOffer).toBeInTheDocument();

  return featuredOffer;
};

const givenTenancyBannerRenders = async (container: RenderResult['container']) => {
  const banner = await within(container).findByAltText('banner-0 banner');
  expect(banner).toBeInTheDocument();

  return banner;
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
    brand: 'blc-uk',
    ...args,
  });
};

const thenAxeHasNoViolations = async (container: RenderResult['container']) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

const mockedCategoryOffer = givenMockedCategoryOffer();
const mockedFeaturedOffer = givenMockedFeaturedOffer();

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

  describe.each([
    {
      name: 'Success',
      scenario: <Success />,
      flagState: 'off',
      categoryOfferID: mockedCategoryOffer.legacyOfferID,
      categoryOfferCompanyId: mockedCategoryOffer.legacyCompanyID,
      featuredOfferID: mockedFeaturedOffer.legacyOfferID,
      featuredOfferCompanyID: mockedFeaturedOffer.legacyCompanyID,
    },
    {
      name: 'With CMS Offers',
      scenario: <WithCmsOffers />,
      flagState: 'on',
      categoryOfferID: mockedCategoryOffer.offerID,
      categoryOfferCompanyId: mockedCategoryOffer.companyID,
      featuredOfferID: mockedFeaturedOffer.offerID,
      featuredOfferCompanyID: mockedFeaturedOffer.companyID,
    },
  ])(
    'it renders: $name',
    ({
      scenario,
      flagState,
      categoryOfferID,
      categoryOfferCompanyId,
      featuredOfferID,
      featuredOfferCompanyID,
    }) => {
      let result: RenderResult;
      let container: RenderResult['container'];

      const givenFeatureFlagIsSet = (state: string = 'off') => {
        storybookPlatformAdapter.getAmplitudeFeatureFlag = () => state;
      };

      beforeEach(() => {
        givenFeatureFlagIsSet(flagState);
        result = render(scenario, { wrapper });
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
          offerId: categoryOfferID,
          companyId: categoryOfferCompanyId,
          companyName: mockedCategoryOffer.companyName,
        });
      });

      describe('and renders the featured offers carousel', () => {
        test('with the title', async () => {
          await givenFeaturedOffersTitleRenders(container);
        });

        test('with an offer', async () => {
          const mockedFeaturedOffer = givenMockedFeaturedOffer();
          await givenFeaturedOfferRenders(container, mockedFeaturedOffer);
        });

        test('with an offer click event that opens the offer sheet', async () => {
          const mockedFeaturedOffer = givenMockedFeaturedOffer();
          const featuredOffer = await givenFeaturedOfferRenders(container, mockedFeaturedOffer);
          await whenOfferIsClicked(featuredOffer);

          thenOfferSheetIsOpened({
            offerId: featuredOfferID,
            companyId: featuredOfferCompanyID,
            companyName: mockedFeaturedOffer.companyName,
          });
        });
      });

      test('and renders the tenancy banner', async () => {
        await givenTenancyBannerRenders(container);
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
          company_id: categoryOfferCompanyId,
          offer_name: mockedCategoryOffer.offerName,
          offer_id: categoryOfferID,
        });
      });

      test('and has no accessibility violations', async () => {
        await givenCategoryTitleRenders(container);
        await thenAxeHasNoViolations(container);
      });
    }
  );

  describe('it renders: With Pagination', () => {
    let result: RenderResult;
    let container: RenderResult['container'];

    const givenPageButtonRenders = async (page: number) => {
      const pageButton = await within(container).findByRole('button', { name: page.toString() });
      expect(pageButton).toBeInTheDocument();

      return pageButton;
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

    describe('and renders for the last page', () => {
      test('and renders a button', async () => {
        await givenPageButtonRenders(7);
      });

      test('and shows the last page of results when clicked', async () => {
        const page7Button = await givenPageButtonRenders(7);
        await whenPageButtonIsClicked(page7Button);
        await thenNumberedResultRenders(73);
      });
    });

    describe('and renders for the first page', () => {
      test('and renders a button', async () => {
        await givenPageButtonRenders(1);
      });

      test('and shows the first page of results when clicked', async () => {
        const page7Button = await givenPageButtonRenders(7);
        await whenPageButtonIsClicked(page7Button);

        const page1Button = await givenPageButtonRenders(1);
        await whenPageButtonIsClicked(page1Button);

        await thenNumberedResultRenders(1);
      });
    });
  });
});
