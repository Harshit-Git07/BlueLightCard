import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '@/pages';
import { AppStore } from '@/store/types';
import { AppContext } from '@/store';
import '@testing-library/jest-dom';
import { APIUrl, Channels } from '@/globals';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { Brand } from '@/components/PopularBrands/types';
import eventBus from '@/eventBus';
import useOffers from '@/hooks/useOffers';

jest.mock('@/invoke/apiCall');
jest.mock('@/modules/popularbrands/brands');
jest.mock('@/hooks/useOffers');

const useOffersMock = jest.mocked(useOffers);

// Old & new way of storing experiments, eventually all will be moved to atoms
let appContextExperiments: Record<string, string>;
let atomExperiments: Record<string, string>;

describe('Home', () => {
  let bus = eventBus();

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
  });

  beforeEach(() => {
    jest.resetAllMocks();

    useOffersMock.mockReturnValue({
      flexible: {
        title: 'Flexible offer carousel',
        random: false,
        subtitle: '',
        items: [],
      },
      deals: [],
      groups: [
        {
          title: 'Standard offer carousel',
          random: false,
          items: [],
        },
      ],
    });

    appContextExperiments = {
      [Experiments.HOMEPAGE_SEARCHBAR]: 'control',
      [Experiments.FAVOURITED_BRANDS]: 'off',
      [Experiments.POPULAR_OFFERS]: 'control',
      [Experiments.STREAMLINED_HOMEPAGE]: 'off',
    };
  });

  describe('Search Bar Experiment', () => {
    const placeholderText = 'Search stores or brands';

    it('should render when experiment enabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.HOMEPAGE_SEARCHBAR]: 'treatment',
      };

      whenHomePageIsRendered();

      const searchBar = screen.queryByPlaceholderText(placeholderText);
      expect(searchBar).toBeInTheDocument();
    });

    it('should not render when experiment disabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.HOMEPAGE_SEARCHBAR]: 'control',
      };

      whenHomePageIsRendered();

      const searchBar = screen.queryByPlaceholderText(placeholderText);
      expect(searchBar).not.toBeInTheDocument();
    });
  });

  describe('Favourited Brands Experiment', () => {
    it('should render when experiment enabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.FAVOURITED_BRANDS]: 'on',
      };

      whenHomePageIsRendered();

      const favouritedBrandsTitle = screen.queryByText('Your favourite brands');
      expect(favouritedBrandsTitle).toBeInTheDocument();
    });

    it('should not render when experiment disabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.FAVOURITED_BRANDS]: 'off',
      };

      whenHomePageIsRendered();

      const favouritedBrandsTitle = screen.queryByText('Your favourite brands');
      expect(favouritedBrandsTitle).not.toBeInTheDocument();
    });
  });

  describe('Popular Offers Experiment', () => {
    describe('with popular offers experiment enabled & favourited brands disabled', () => {
      beforeEach(() => {
        appContextExperiments = {
          ...appContextExperiments,
          [Experiments.FAVOURITED_BRANDS]: 'off',
          [Experiments.POPULAR_OFFERS]: 'treatment',
        };
        atomExperiments = {
          ...atomExperiments,
        };
      });

      it('should render', () => {
        whenHomePageIsRendered();

        const popularBrandsTitle = screen.queryByText('Popular brands');
        expect(popularBrandsTitle).toBeInTheDocument();
      });
    });

    it('should not render when experiment enabled & favourited brands enabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.FAVOURITED_BRANDS]: 'on',
        [Experiments.POPULAR_OFFERS]: 'treatment',
      };

      whenHomePageIsRendered();

      const popularBrandsTitle = screen.queryByText('Popular brands');
      expect(popularBrandsTitle).not.toBeInTheDocument();
    });

    it('should not render when experiment disabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.POPULAR_OFFERS]: 'control',
      };

      whenHomePageIsRendered();

      const popularBrandsTitle = screen.queryByText('Popular brands');
      expect(popularBrandsTitle).not.toBeInTheDocument();
    });
  });

  describe('Streamlined homepage Experiment', () => {
    it('should render "News" below standard offer carousel when experiment enabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.STREAMLINED_HOMEPAGE]: 'on',
      };

      whenHomePageIsRendered();

      const newsTitle = screen.getByText('Latest news');
      const standardOfferCarousel = screen.getByText('Standard offer carousel');
      expect(newsTitle.compareDocumentPosition(standardOfferCarousel)).toBe(2);
    });

    it('should render "News" above standard offer carousel when experiment disabled', () => {
      appContextExperiments = {
        ...appContextExperiments,
        [Experiments.STREAMLINED_HOMEPAGE]: 'off',
      };

      whenHomePageIsRendered();

      const newsTitle = screen.getByText('Latest news');
      const standardOfferCarousel = screen.getByText('Standard offer carousel');
      expect(standardOfferCarousel.compareDocumentPosition(newsTitle)).toBe(2);
    });
  });
});

const whenHomePageIsRendered = () => {
  const mockAppContext: Partial<AppStore> = {
    experiments: appContextExperiments,
    apiData: {
      [APIUrl.FavouritedBrands]: {
        data: [
          {
            cid: 1,
            companyname: 'Test Company',
            logos: '',
          },
        ],
      },
    },
  };

  render(
    <AppContext.Provider value={mockAppContext as AppStore}>
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, atomExperiments]]}>
        <Home />
      </JotaiTestProvider>
    </AppContext.Provider>,
  );
};
