/* eslint-disable react/display-name */
import '@testing-library/jest-dom';
import { makeSearch } from '../../common/utils/API/makeSearch';
import TokenisedSearch from '../../pages/tokenised-search';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NetworkStatus } from '@apollo/client';
import AuthContext, { AuthContextType } from '../../common/context/Auth/AuthContext';
import UserContext, { UserContextType } from '../../common/context/User/UserContext';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import userEvent from '@testing-library/user-event';
import { makeQuery, makeNavbarQueryWithDislikeRestrictions } from '../../graphql/makeQuery';
import {
  AuthedAmplitudeExperimentProvider,
  useAmplitudeExperiment,
} from '../../common/context/AmplitudeExperiment';
import { as } from '@core/utils/testing';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Factory } from 'fishery';
import _noop from 'lodash/noop';
import { logSearchCardClicked } from '@/utils/amplitude';

expect.extend(toHaveNoViolations);

jest.mock('@amplitude/analytics-browser', () => ({
  Types: { LogLevel: {} },
  track: jest.fn().mockReturnValue(Promise.resolve()),
}));

jest.mock('../../common/utils/API/makeSearch');
jest.mock('../../graphql/makeQuery');
jest.mock('@/utils/amplitude', () => ({
  logSearchCategoryEvent: jest.fn(),
  logSearchCardClicked: jest.fn(),
  logSearchCompanyEvent: jest.fn(),
  logSearchPage: jest.fn(),
  logSearchTermEvent: jest.fn(),
  logSerpSearchStarted: jest.fn(),
}));
jest.mock('@/context/AmplitudeExperiment', () => ({
  ...jest.requireActual('@/context/AmplitudeExperiment'),
  useAmplitudeExperiment: jest.fn(),
}));

const makeSearchMock = jest.mocked(makeSearch);
const makeQueryMock = jest.mocked(makeQuery);
const makeNavbarQueryMock = jest.mocked(makeNavbarQueryWithDislikeRestrictions);
const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
  query: { q: 'Apple' },
};

const userContextTypeFactory = Factory.define<UserContextType>(() => ({
  dislikes: [],
  error: undefined,
  isAgeGated: false,
  setUser: _noop,
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: 'mock-dob',
      organisation: 'mock-organisation',
    },
    uuid: 'mock-uuid',
  },
}));

describe('SearchPage', () => {
  beforeEach(() => {
    makeQueryMock.mockResolvedValue({
      data: [],
      loading: false,
      networkStatus: NetworkStatus.ready,
    });
    makeNavbarQueryMock.mockResolvedValue({
      data: {
        response: {
          categories: [],
          companies: [],
        },
      },
      loading: false,
      networkStatus: NetworkStatus.ready,
    });
  });

  it('Renders loading placeholders', async () => {
    makeSearchMock.mockReturnValue(new Promise((resolve) => setTimeout(resolve, 2000)));
    whenSearchPageIsRendered('control');

    const [offerCardPlaceholder] = await screen.findAllByTestId('offer-card-placeholder');

    expect(offerCardPlaceholder).toBeInTheDocument();
  });

  it('Renders no results message', async () => {
    makeSearchMock.mockResolvedValue({ results: [] });
    whenSearchPageIsRendered('control');

    const noResults = await screen.findByText('No results found');

    expect(noResults).toBeInTheDocument();
  });

  it('Renders results', async () => {
    givenResultsAreReturned();
    whenSearchPageIsRendered('control');

    const offerCard = await screen.findByTestId('offer-card-123');

    expect(offerCard).toBeInTheDocument();
  });

  describe('Offer types', () => {
    it('Renders offer type 0 as an Online offer', async () => {
      givenResultsAreReturned();
      whenSearchPageIsRendered('control');

      const [onlineOffer] = await screen.findAllByText('Online');

      expect(onlineOffer).toBeInTheDocument();
      expect(onlineOffer.parentElement).toHaveTextContent('Online Offer 1');
    });

    it('Renders offer type 2 as a Gift Card offer', async () => {
      givenResultsAreReturned();
      whenSearchPageIsRendered('control');

      const [giftcardOffer] = await screen.findAllByText('Gift card');

      expect(giftcardOffer).toBeInTheDocument();
      expect(giftcardOffer.parentElement).toHaveTextContent('Gift Card Offer 1');
    });

    it('Renders offer type 5 as an In-store offer', async () => {
      givenResultsAreReturned();
      whenSearchPageIsRendered('control');

      const [instoreOffer] = await screen.findAllByText('In-store');

      expect(instoreOffer).toBeInTheDocument();
      expect(instoreOffer.parentElement).toHaveTextContent('In-store Offer 1');
    });

    it('Renders offer type 6 as an In-store offer', async () => {
      givenResultsAreReturned();
      whenSearchPageIsRendered('control');

      const [_, instoreOffer2] = await screen.findAllByText('In-store');

      expect(instoreOffer2).toBeInTheDocument();
      expect(instoreOffer2.parentElement).toHaveTextContent('In-store Offer 2');
    });

    it('Renders other offer types as an Online offer', async () => {
      givenResultsAreReturned();
      whenSearchPageIsRendered('control');

      const [_, onlineOffer2] = await screen.findAllByText('Online');

      expect(onlineOffer2).toBeInTheDocument();
      expect(onlineOffer2.parentElement).toHaveTextContent('Apple');
    });
  });

  it('Renders categories section', async () => {
    givenResultsAreReturned();
    makeNavbarQueryMock.mockResolvedValue({
      data: {
        response: {
          categories: [
            { id: '1', name: 'Category One' },
            { id: '2', name: 'Category Two' },
          ],
          companies: [],
        },
      },
      loading: false,
      networkStatus: NetworkStatus.ready,
    });

    whenSearchPageIsRendered('control');

    const categoryOne = await screen.findByText('Category One');

    expect(categoryOne).toBeInTheDocument();
  });

  it('Navigates to the category page when a category is clicked', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://localhost',
      },
      writable: true,
    });

    givenResultsAreReturned();
    makeNavbarQueryMock.mockResolvedValue({
      data: {
        response: {
          categories: [
            { id: '1', name: 'Category One' },
            { id: '2', name: 'Category Two' },
          ],
          companies: [],
        },
      },
      loading: false,
      networkStatus: NetworkStatus.ready,
    });

    whenSearchPageIsRendered('control');

    const categoryOne = await screen.findByText('Category One');
    await userEvent.click(categoryOne);

    expect(window.location.href).toEqual('/offers.php?cat=true&type=1');
  });

  it('Renders tenancy adverts', async () => {
    givenResultsAreReturned();
    makeQueryMock.mockResolvedValue({
      data: {
        banners: [{ imageSource: 'https://test1.image', link: 'https://test1.link' }],
      },
      loading: false,
      networkStatus: NetworkStatus.ready,
    });

    whenSearchPageIsRendered('control');

    const advertImage = await screen.findByAltText("0 + 'banner' banner");

    expect(advertImage).toBeInTheDocument();
    expect(advertImage).toHaveAttribute('src', 'https://test1.image/?width=3840&quality=75');
  });

  it('Has no accessibility violations', async () => {
    givenResultsAreReturned();

    const { container } = whenSearchPageIsRendered('control');
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    makeQueryMock.mockResolvedValue({
      data: [],
      loading: false,
      networkStatus: NetworkStatus.ready,
    });
  });
  it.each(['treatment', 'control'])('should logSearchCardClicked event', async (variant) => {
    givenResultsAreReturned();
    whenSearchPageIsRendered(variant);

    await whenOfferCardClicked();
    thenAmplitudeEventFired();
  });
});

const givenResultsAreReturned = () => {
  makeSearchMock.mockResolvedValue({
    results: [
      {
        ID: 121,
        OfferName: 'Online Offer 1',
        offerimg: 'online offer img',
        CompID: 340,
        CompanyName: 'Online Company',
        OfferType: 0,
      },
      {
        ID: 122,
        OfferName: 'Gift Card Offer 1',
        offerimg: 'gift card offer img',
        CompID: 341,
        CompanyName: 'Gift Card Company',
        OfferType: 2,
      },
      {
        ID: 123,
        OfferName: 'Apple',
        offerimg: 'apple img',
        CompID: 342,
        CompanyName: 'Apple',
        OfferType: 4,
      },
      {
        ID: 124,
        OfferName: 'In-store Offer 1',
        offerimg: 'in-store offer img 1',
        CompID: 343,
        CompanyName: 'In-store Company',
        OfferType: 5,
      },
      {
        ID: 125,
        OfferName: 'In-store Offer 2',
        offerimg: 'in-store offer img 2',
        CompID: 343,
        CompanyName: 'In-store Company',
        OfferType: 6,
      },
    ],
  });
};

const whenSearchPageIsRendered = (variant: string) => {
  const mockAuthContext: Partial<AuthContextType> = {
    authState: {
      idToken: '23123',
      accessToken: '111',
      refreshToken: '543',
      username: 'test',
    },
    isUserAuthenticated: as(_noop),
  };
  const userContext = userContextTypeFactory.build();

  const mockExperimentClient = {
    variant: jest.fn().mockReturnValue({ variant }),
  } satisfies Pick<ExperimentClient, 'variant'>;

  (useAmplitudeExperiment as jest.Mock).mockReturnValue({ data: { variantName: variant } });

  const experimentClientMock: () => Promise<ExperimentClient> = () =>
    Promise.resolve(as(mockExperimentClient));

  return render(
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={userContext}>
        <AuthedAmplitudeExperimentProvider initExperimentClient={experimentClientMock}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <AuthContext.Provider value={mockAuthContext as AuthContextType}>
              <UserContext.Provider value={userContext}>
                <TokenisedSearch />
              </UserContext.Provider>
            </AuthContext.Provider>
          </RouterContext.Provider>
        </AuthedAmplitudeExperimentProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

const whenOfferCardClicked = async () => {
  let user = userEvent.setup();

  const offerCard = await screen.findByTestId('offer-card-123');

  await user.click(offerCard.children[0].children[0]);
};

const thenAmplitudeEventFired = () => {
  expect(logSearchCardClicked).toHaveBeenCalledWith(342, 'Apple', 123, 'Apple', 'Apple', 5, 3);
};
