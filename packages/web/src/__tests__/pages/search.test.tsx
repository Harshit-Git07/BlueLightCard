/* eslint-disable react/display-name */
import '@testing-library/jest-dom';
import { makeSearch } from '@/utils/API/makeSearch';
import Search from '../../pages/search';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NetworkStatus } from '@apollo/client';
import AuthContext, { AuthContextType } from '../../common/context/Auth/AuthContext';
import UserContext, { UserContextType } from '../../common/context/User/UserContext';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import userEvent from '@testing-library/user-event';
import { makeQuery } from '../../graphql/makeQuery';
import {
  AuthedAmplitudeExperimentProvider,
  useAmplitudeExperiment,
} from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { as } from '@core/utils/testing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Factory } from 'fishery';
import _noop from 'lodash/noop';
import { logSearchCardClicked } from '@/utils/amplitude';
import {
  IPlatformAdapter,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui/adapters';
import { experimentMakeSearch } from '@/utils/API/experimentMakeSearch';
import { PlatformVariant } from '@bluelightcard/shared-ui/types';
import { offerTypeLabelMap } from '@bluelightcard/shared-ui/index';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import useFetchCompaniesOrCategories from '@/hooks/useFetchCompaniesOrCategories';

expect.extend(toHaveNoViolations);

jest.mock('@amplitude/analytics-browser', () => ({
  Types: { LogLevel: {} },
  track: jest.fn().mockReturnValue(Promise.resolve()),
}));

jest.mock('../../common/utils/API/makeSearch');
jest.mock('../../common/utils/API/experimentMakeSearch');
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
jest.mock('../../common/hooks/useFetchCompaniesOrCategories');

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());

const tenancyBannersMock = jest.fn();
jest.mock('../../common/components/TenancyBanner/useTenancyBanners', () => ({
  __esModule: true,
  default: () => tenancyBannersMock(),
}));

const makeSearchMock = jest.mocked(makeSearch);
const experimentMakeSearchMock = jest.mocked(experimentMakeSearch);
const makeQueryMock = jest.mocked(makeQuery);
const useFetchCompaniesOrCategoriesMock = jest.mocked(useFetchCompaniesOrCategories);
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
  mockPlatformAdapter = useMockPlatformAdapter(200, { data: [] }, PlatformVariant.Web);

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    makeSearchMock.mockResolvedValue({ results: [] });
    experimentMakeSearchMock.mockResolvedValue({ results: [] });

    makeQueryMock.mockResolvedValue({
      data: [],
      loading: false,
      networkStatus: NetworkStatus.ready,
    });
    useFetchCompaniesOrCategoriesMock.mockReturnValue({
      categories: [],
      companies: [],
      isLoading: false,
    });

    tenancyBannersMock.mockReturnValue({
      loaded: true,
      banners: [
        {
          imageUrl: 'test-image.jpg',
          url: 'test-link',
          title: 'Test Braze Card',
          isControl: false,
          extras: { destination: 'bottom-banner' },
        },
      ],
    });
  });

  describe('Experiments', () => {
    it('should not call search functions when experiments are still loading', () => {
      (useAmplitudeExperiment as jest.Mock).mockImplementation(() => {
        return { status: 'pending' };
      });

      whenSearchPageIsRendered();

      expect(makeSearchMock).not.toHaveBeenCalled();
      expect(experimentMakeSearchMock).not.toHaveBeenCalled();
    });

    it('should call "makeSearch" only when "search V5" experiment is "control"', () => {
      givenExperimentsReturn('control', 'control');

      whenSearchPageIsRendered();

      expect(makeSearchMock).toHaveBeenCalled();
      expect(experimentMakeSearchMock).not.toHaveBeenCalled();
    });

    it('should call both "makeSearch" and "experimentMakeSearch" when "search V5" experiment is "dark-read"', () => {
      givenExperimentsReturn('control', 'dark-read');

      whenSearchPageIsRendered();

      expect(makeSearchMock).toHaveBeenCalled();
      expect(experimentMakeSearchMock).toHaveBeenCalled();
    });

    it('should call "experimentMakeSearch" only when "search V5" experiment is "treatment"', () => {
      givenExperimentsReturn('control', 'treatment');

      whenSearchPageIsRendered();

      expect(makeSearchMock).not.toHaveBeenCalled();
      expect(experimentMakeSearchMock).toHaveBeenCalled();
    });

    it('should call "experimentMakeSearch" with useLegacyId as false when offers cms is enabled', () => {
      givenExperimentsReturn('control', 'treatment', 'on');

      whenSearchPageIsRendered();

      expect(makeSearchMock).not.toHaveBeenCalled();
      expect(experimentMakeSearchMock).toHaveBeenCalledWith('Apple', expect.anything(), false);
    });

    it('should call "experimentMakeSearch" with useLegacyId as true when offers cms is disabled', () => {
      givenExperimentsReturn('control', 'treatment', 'off');

      whenSearchPageIsRendered();

      expect(makeSearchMock).not.toHaveBeenCalled();
      expect(experimentMakeSearchMock).toHaveBeenCalledWith('Apple', expect.anything(), true);
    });
  });

  describe('and "search V5" experiment is not enabled', () => {
    beforeEach(() => {
      givenExperimentsReturn('control', 'control');
    });

    it('Renders loading placeholders', async () => {
      makeSearchMock.mockReturnValue(new Promise((resolve) => setTimeout(resolve, 2000)));

      whenSearchPageIsRendered();

      const [offerCardPlaceholder] = await screen.findAllByTestId('offer-card-placeholder');
      expect(offerCardPlaceholder).toBeInTheDocument();
    });

    it('Renders no results message', async () => {
      makeSearchMock.mockResolvedValue({ results: [] });

      whenSearchPageIsRendered();

      const noResults = await screen.findByText('No results found');
      expect(noResults).toBeInTheDocument();
    });

    it('Renders results', async () => {
      givenResultsAreReturned();

      whenSearchPageIsRendered();

      const offerCard = await screen.findByTestId('offer-card-123');
      expect(offerCard).toBeInTheDocument();
    });

    describe('Offer types', () => {
      it('Renders offer type 0 as an Online offer', async () => {
        givenResultsAreReturned();

        whenSearchPageIsRendered();

        const [onlineOffer] = await screen.findAllByText('Online');
        expect(onlineOffer).toBeInTheDocument();
        expect(onlineOffer.parentElement).toHaveTextContent('Online Offer 1');
      });

      it('Renders offer type 2 as a Gift Card offer', async () => {
        givenResultsAreReturned();

        whenSearchPageIsRendered();

        const [giftcardOffer] = await screen.findAllByText(offerTypeLabelMap['gift-card']);
        expect(giftcardOffer).toBeInTheDocument();
        expect(giftcardOffer.parentElement).toHaveTextContent('Gift Card Offer 1');
      });

      it('Renders offer type 5 as an In-store offer', async () => {
        givenResultsAreReturned();

        whenSearchPageIsRendered();

        const [instoreOffer] = await screen.findAllByText('In-store');
        expect(instoreOffer).toBeInTheDocument();
        expect(instoreOffer.parentElement).toHaveTextContent('In-store Offer 1');
      });

      it('Renders offer type 6 as an In-store offer', async () => {
        givenResultsAreReturned();

        whenSearchPageIsRendered();

        const [, instoreOffer2] = await screen.findAllByText('In-store');
        expect(instoreOffer2).toBeInTheDocument();
        expect(instoreOffer2.parentElement).toHaveTextContent('In-store Offer 2');
      });

      it('Renders other offer types as an Online offer', async () => {
        givenResultsAreReturned();

        whenSearchPageIsRendered();

        const [, onlineOffer2] = await screen.findAllByText('Online');
        expect(onlineOffer2).toBeInTheDocument();
        expect(onlineOffer2.parentElement).toHaveTextContent('Apple');
      });
    });

    it('Renders categories section', async () => {
      givenResultsAreReturned();
      useFetchCompaniesOrCategoriesMock.mockReturnValue({
        categories: [
          {
            id: '1',
            name: 'Category One',
          },
          {
            id: '2',
            name: 'Category Two',
          },
        ],
        companies: [],
        isLoading: false,
      });

      whenSearchPageIsRendered();

      const categoryOne = await screen.findByText('Category One');
      expect(categoryOne).toBeInTheDocument();
    });

    it('Navigates to the category page when a category is clicked', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://localhost',
          pathname: '',
        },
        writable: true,
      });
      givenResultsAreReturned();
      useFetchCompaniesOrCategoriesMock.mockReturnValue({
        categories: [
          {
            id: '1',
            name: 'Category One',
          },
          {
            id: '2',
            name: 'Category Two',
          },
        ],
        companies: [],
        isLoading: false,
      });

      whenSearchPageIsRendered();

      const categoryOne = await screen.findByText('Category One');
      await userEvent.click(categoryOne);
      expect(window.location.href).toEqual('/offers.php?cat=true&type=1');
    });

    describe('Renders tenancy banners', () => {
      test('Using GraphQL query if Braze Content Cards are disabled', async () => {
        givenResultsAreReturned();
        makeQueryMock.mockResolvedValue({
          data: {
            banners: [
              {
                imageSource: 'https://test1.image',
                link: 'https://test1.link',
              },
            ],
          },
          loading: false,
          networkStatus: NetworkStatus.ready,
        });

        givenExperimentsReturn('control', 'control', 'off', 'control');
        whenSearchPageIsRendered();

        const advertImage = await screen.findByAltText("0 + 'banner' banner");
        expect(advertImage).toBeInTheDocument();
        expect(advertImage).toHaveAttribute('src', 'https://test1.image/?width=3840&quality=75');
      });

      test('Using Braze Content Cards if enabled', async () => {
        givenResultsAreReturned();
        makeQueryMock.mockResolvedValue({
          data: {
            banners: [],
          },
          loading: false,
          networkStatus: NetworkStatus.ready,
        });

        givenExperimentsReturn('control', 'control', 'off', 'treatment');
        whenSearchPageIsRendered();

        const brazeCarousel = await screen.findByTestId('braze-tenancy-banner_small');
        expect(brazeCarousel).toBeInTheDocument();
      });
    });

    it('Has no accessibility violations', async () => {
      givenResultsAreReturned();

      const { container } = whenSearchPageIsRendered();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
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
    useFetchCompaniesOrCategoriesMock.mockReturnValue({
      categories: [],
      companies: [],
      isLoading: false,
    });
  });
  it.each(['treatment', 'control'])('should logSearchCardClicked event', async (variant) => {
    givenResultsAreReturned();
    givenExperimentsReturn(variant, 'control');
    whenSearchPageIsRendered();
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

const givenExperimentsReturn = (
  categorySearch: string,
  v5Search: string,
  cmsOffers = 'off',
  brazeConentCards: string = 'control'
) => {
  (useAmplitudeExperiment as jest.Mock).mockImplementation((experimentFlag, defaultVariant) => {
    if (experimentFlag === 'search_v5') {
      return { data: { variantName: v5Search } };
    }

    if (experimentFlag === 'cms-offers') {
      return { data: { variantName: cmsOffers } };
    }

    if (experimentFlag === AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED) {
      return { data: { variantName: brazeConentCards } };
    }

    return { data: { variantName: defaultVariant } };
  });
};

const whenSearchPageIsRendered = () => {
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
    variant: jest.fn().mockReturnValue({ value: 'off' }),
  } satisfies Pick<ExperimentClient, 'variant'>;

  const experimentClientMock: () => Promise<ExperimentClient> = () =>
    Promise.resolve(as(mockExperimentClient));

  return render(
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={userContext}>
        <AuthedAmplitudeExperimentProvider initExperimentClient={experimentClientMock}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <RouterContext.Provider value={mockRouter as NextRouter}>
              <AuthContext.Provider value={mockAuthContext as AuthContextType}>
                <UserContext.Provider value={userContext}>
                  <Search />
                </UserContext.Provider>
              </AuthContext.Provider>
            </RouterContext.Provider>
          </PlatformAdapterProvider>
        </AuthedAmplitudeExperimentProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

const whenOfferCardClicked = async () => {
  const user = userEvent.setup();

  const offerCard = await screen.findByTestId('offer-card-123');

  await user.click(offerCard.children[0].children[0]);
};

const thenAmplitudeEventFired = () => {
  expect(logSearchCardClicked).toHaveBeenCalledWith(342, 'Apple', 123, 'Apple', 'Apple', 5, 3);
};
