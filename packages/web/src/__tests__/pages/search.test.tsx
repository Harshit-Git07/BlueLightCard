/* eslint-disable react/display-name */
import '@testing-library/jest-dom';
import { makeSearch } from '../../common/utils/API/makeSearch';
import Search from '../../pages/search';
import { render, screen } from '@testing-library/react';
import { NetworkStatus } from '@apollo/client';
import AuthContext, { AuthContextType } from '../../common/context/Auth/AuthContext';
import UserContext, { UserContextType } from '../../common/context/User/UserContext';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import userEvent from '@testing-library/user-event';
import { makeQuery } from '../../graphql/makeQuery';
import { AuthedAmplitudeExperimentProvider } from '../../common/context/AmplitudeExperiment';
import { as } from '@core/utils/testing';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Factory } from 'fishery';
import _noop from 'lodash/noop';
import { logSearchCardClicked } from '@/utils/amplitude';
import {
  IPlatformAdapter,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui/adapters';

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
const makeSearchMock = jest.mocked(makeSearch);
const makeQueryMock = jest.mocked(makeQuery);
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
let mockPlatformAdapter: IPlatformAdapter;

describe('SearchPage', () => {
  mockPlatformAdapter = useMockPlatformAdapter();

  beforeEach(() => {
    makeQueryMock.mockResolvedValue({
      data: [],
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

    const offerCard = await screen.findByTestId('_offer_card_0');

    expect(offerCard).toBeInTheDocument();
  });

  it('Renders tokenised results for tokenised-search experiment', async () => {
    givenResultsAreReturned();
    whenSearchPageIsRendered('on');

    const offerCard = await screen.findByTestId('offer-card-123');

    expect(offerCard).toBeInTheDocument();
  });

  describe('Analytics', () => {
    it.each(['treatment', 'control'])('should logSearchCardClicked event', async (variant) => {
      givenResultsAreReturned();
      whenSearchPageIsRendered(variant);

      await whenOfferCardClicked();
      thenAmplitudeEventFired();
    });
  });
});

const givenResultsAreReturned = () => {
  makeSearchMock.mockResolvedValue({
    results: [
      {
        ID: 123,
        OfferName: 'Apple',
        offerimg: 'apple img',
        CompID: 342,
        CompanyName: 'Apple',
        OfferType: 4,
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
    variant: jest.fn().mockReturnValue({ value: variant }),
  } satisfies Pick<ExperimentClient, 'variant'>;

  const experimentClientMock: () => Promise<ExperimentClient> = () =>
    Promise.resolve(as(mockExperimentClient));

  render(
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={userContext}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <AuthedAmplitudeExperimentProvider initExperimentClient={experimentClientMock}>
            <RouterContext.Provider value={mockRouter as NextRouter}>
              <AuthContext.Provider value={mockAuthContext as AuthContextType}>
                <UserContext.Provider value={userContext}>
                  <Search />
                </UserContext.Provider>
              </AuthContext.Provider>
            </RouterContext.Provider>
          </AuthedAmplitudeExperimentProvider>
        </PlatformAdapterProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

const whenOfferCardClicked = async () => {
  const user = userEvent.setup();

  const offerCard = await screen.findByTestId('_offer_card_0');

  await user.click(offerCard);
};

const thenAmplitudeEventFired = () => {
  expect(logSearchCardClicked).toHaveBeenCalledWith(342, 'Apple', 123, 'Apple', 'Apple', 1, 1);
};
