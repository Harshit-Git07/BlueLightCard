import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '@/pages';
import '@testing-library/jest-dom';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import eventBus from '@/eventBus';
import useOffers from '@/hooks/useOffers';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';

jest.mock('@/invoke/apiCall');
jest.mock('@/modules/popularbrands/brands');
jest.mock('@/hooks/useOffers');
jest.mock('@/hooks/useFavouritedBrands');

const useOffersMock = jest.mocked(useOffers);
const useFavouritedBrandsMock = jest.mocked(useFavouritedBrands);

let amplitudeFlagsAndExperiments: Record<string, string>;

describe('Home', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    useOffersMock.mockReturnValue({
      flexible: {
        title: 'Flexible offer carousel',
        random: false,
        subtitle: '',
        items: [],
      },
      deal: [],
      groups: [
        {
          title: 'Standard offer carousel',
          random: false,
          items: [],
        },
      ],
    });

    amplitudeFlagsAndExperiments = {
      [Experiments.HOMEPAGE_SEARCHBAR]: 'control',
      [Experiments.FAVOURITED_BRANDS]: 'off',
      [Experiments.POPULAR_OFFERS]: 'control',
      [Experiments.STREAMLINED_HOMEPAGE]: 'off',
    };
  });

  describe('Search Bar Experiment', () => {
    const placeholderText = 'Search stores or brands';

    it('should render when experiment enabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
        [Experiments.HOMEPAGE_SEARCHBAR]: 'treatment',
      };

      whenHomePageIsRendered();

      const searchBar = screen.queryByPlaceholderText(placeholderText);
      expect(searchBar).toBeInTheDocument();
    });

    it('should not render when experiment disabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
        [Experiments.HOMEPAGE_SEARCHBAR]: 'control',
      };

      whenHomePageIsRendered();

      const searchBar = screen.queryByPlaceholderText(placeholderText);
      expect(searchBar).not.toBeInTheDocument();
    });
  });

  describe('Favourited Brands Experiment', () => {
    it('should render when experiment enabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
        [Experiments.FAVOURITED_BRANDS]: 'on',
      };

      whenHomePageIsRendered();

      const favouritedBrandsTitle = screen.queryByText('Your favourite brands');
      expect(favouritedBrandsTitle).toBeInTheDocument();
    });

    it('should not render when experiment disabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
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
        amplitudeFlagsAndExperiments = {
          ...amplitudeFlagsAndExperiments,
          [Experiments.FAVOURITED_BRANDS]: 'off',
          [Experiments.POPULAR_OFFERS]: 'treatment',
        };
      });

      it('should render', () => {
        whenHomePageIsRendered();

        const popularBrandsTitle = screen.queryByText('Popular brands');
        expect(popularBrandsTitle).toBeInTheDocument();
      });
    });

    it('should not render when experiment enabled & favourited brands enabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
        [Experiments.FAVOURITED_BRANDS]: 'on',
        [Experiments.POPULAR_OFFERS]: 'treatment',
      };

      whenHomePageIsRendered();

      const popularBrandsTitle = screen.queryByText('Popular brands');
      expect(popularBrandsTitle).not.toBeInTheDocument();
    });

    it('should not render when experiment disabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
        [Experiments.POPULAR_OFFERS]: 'control',
      };

      whenHomePageIsRendered();

      const popularBrandsTitle = screen.queryByText('Popular brands');
      expect(popularBrandsTitle).not.toBeInTheDocument();
    });
  });

  describe('Streamlined homepage Experiment', () => {
    it('should render "News" below standard offer carousel when experiment enabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
        [Experiments.STREAMLINED_HOMEPAGE]: 'on',
      };

      whenHomePageIsRendered();

      const newsTitle = screen.getByText('Latest news');
      const standardOfferCarousel = screen.getByText('Standard offer carousel');
      expect(newsTitle.compareDocumentPosition(standardOfferCarousel)).toBe(2);
    });

    it('should render "News" above standard offer carousel when experiment disabled', () => {
      amplitudeFlagsAndExperiments = {
        ...amplitudeFlagsAndExperiments,
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
  useFavouritedBrandsMock.mockReturnValue([
    {
      id: 1,
      imageSrc: '',
      brandName: 'Test Company',
    },
  ]);
  render(
    <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, amplitudeFlagsAndExperiments]]}>
      <Home />
    </JotaiTestProvider>,
  );
};
