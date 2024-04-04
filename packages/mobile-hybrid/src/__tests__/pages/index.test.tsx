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
import useRecommendedBrands from '@/hooks/useRecommendedBrands';
import useOffers from '@/hooks/useOffers';

jest.mock('@/invoke/apiCall');
jest.mock('@/hooks/useRecommendedBrands');
jest.mock('@/modules/popularbrands/brands');
jest.mock('@/hooks/useOffers');

const useRecommendedBrandsMock = jest.mocked(useRecommendedBrands);
const useOffersMock = jest.mocked(useOffers);

// Old & new way of storing experiments, eventually all will be moved to atoms
let appContextExperiments: Record<string, string>;
let atomExperiments: Record<string, string>;

const recommendedBrandList: Brand[] = [
  { id: 1, brandName: 'Nike', imageSrc: '' },
  { id: 2, brandName: 'Adidas', imageSrc: '' },
  { id: 3, brandName: 'New Balance', imageSrc: '' },
];

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

    atomExperiments = {
      [Experiments.SPRING_EVENT_RECOMMENDED_BRANDS_SLIDER]: 'control',
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

  describe('Recommended Brands Experiment', () => {
    it('should render when experiment enabled', () => {
      atomExperiments = {
        ...atomExperiments,
        [Experiments.SPRING_EVENT_RECOMMENDED_BRANDS_SLIDER]: 'treatment',
      };
      givenRecommendedBrandsAreReturnedFromTheAPI(recommendedBrandList);

      whenHomePageIsRendered();

      expect(screen.queryByAltText('Nike')).toBeInTheDocument();
      expect(screen.queryByAltText('Adidas')).toBeInTheDocument();
      expect(screen.queryByAltText('New Balance')).toBeInTheDocument();
    });

    it('should not render when experiment disabled', () => {
      atomExperiments = {
        ...atomExperiments,
        [Experiments.SPRING_EVENT_RECOMMENDED_BRANDS_SLIDER]: 'control',
      };

      whenHomePageIsRendered();

      expect(screen.queryByAltText('Nike')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Adidas')).not.toBeInTheDocument();
      expect(screen.queryByAltText('New Balance')).not.toBeInTheDocument();
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
          [Experiments.SPRING_EVENT_RECOMMENDED_BRANDS_SLIDER]: 'control',
        };
        atomExperiments = {
          ...atomExperiments,
          [Experiments.SPRING_EVENT_RECOMMENDED_BRANDS_SLIDER]: 'control',
        };
      });

      it('should render', () => {
        whenHomePageIsRendered();

        const popularBrandsTitle = screen.queryByText('Popular brands');
        expect(popularBrandsTitle).toBeInTheDocument();
      });

      it('should render popular offers above "flexible offer carousel" when spring event not enabled', () => {
        whenHomePageIsRendered();

        const popularBrandsTitle = screen.getByText('Popular brands');
        const flexibleOfferCarousel = screen.getByText('Flexible offer carousel');
        expect(flexibleOfferCarousel.compareDocumentPosition(popularBrandsTitle)).toBe(2);
      });

      it('should render popular offers below "flexible offer carousel" when spring event enabled', () => {
        appContextExperiments = {
          ...appContextExperiments,
          [Experiments.SPRING_EVENT_RECOMMENDED_BRANDS_SLIDER]: 'treatment',
        };
        atomExperiments = {
          ...atomExperiments,
          [Experiments.SPRING_EVENT_RECOMMENDED_BRANDS_SLIDER]: 'treatment',
        };
        givenRecommendedBrandsAreReturnedFromTheAPI(recommendedBrandList);

        whenHomePageIsRendered();

        const popularBrandsTitle = screen.getByText('Popular brands');
        const flexibleOfferCarousel = screen.getByText('Flexible offer carousel');
        expect(popularBrandsTitle.compareDocumentPosition(flexibleOfferCarousel)).toBe(2);
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

const givenRecommendedBrandsAreReturnedFromTheAPI = (recommendedBrands: Brand[]) => {
  useRecommendedBrandsMock.mockReturnValue(recommendedBrands);
};

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
