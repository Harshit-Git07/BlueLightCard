import { render, screen } from '@testing-library/react';
import Home from '@/pages';
import '@testing-library/jest-dom';
import useOffers from '@/hooks/useOffers';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';

jest.mock('@/invoke/apiCall');
jest.mock('@/modules/popularbrands/brands');
jest.mock('@/hooks/useOffers');
jest.mock('@/hooks/useFavouritedBrands');

jest.mock('swiper/react', () => ({
  Swiper: () => null,
  SwiperSlide: () => null,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());
jest.mock('swiper/css/pagination', () => jest.fn());
jest.mock('swiper/css/navigation', () => jest.fn());

const useOffersMock = jest.mocked(useOffers);

import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
let amplitudeFlagsAndExperiments: Record<string, string>;
let controlGroup = false;
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
      [Experiments.POPULAR_OFFERS]: 'treatment',
    };
    whenHomePageIsRendered();
  });

  describe('Search Bar', () => {
    const placeholderText = 'Search stores or brands';
    it('should render when home page is rendered', () => {
      const searchBar = screen.queryByPlaceholderText(placeholderText);
      expect(searchBar).toBeInTheDocument();
    });
  });

  describe('Popular brands', () => {
    it('should render popular brands when home page is rendered and popular offers experiment  is in treatment group - blc-uk', () => {
      const popularBrandsTitle = screen.queryByText('Popular brands');
      expect(popularBrandsTitle).toBeInTheDocument();
    });
  });

  describe('Offers', () => {
    it("should render 'Flexible offer carousel' when home page is rendered", () => {
      const flexibleOfferCarousel = screen.getByText('Flexible offer carousel');
      expect(flexibleOfferCarousel).toBeInTheDocument();
    });

    it("should render 'Standard offer carousel' when home page is rendered", () => {
      const standardOfferCarousel = screen.getByText('Standard offer carousel');
      expect(standardOfferCarousel).toBeInTheDocument();
    });
  });

  describe('News', () => {
    it('should render news page when home page is rendered', () => {
      const newsTitle = screen.getByText('Latest news');
      expect(newsTitle).toBeInTheDocument();
    });
  });

  describe('Home page ordering ', () => {
    it('should render popular brands, offer carousels, latest news in descending order when home page is rendered', () => {
      const popularBrandsTitle = screen.queryByText('Popular brands');
      const standardOfferCarousel = screen.getByText('Standard offer carousel');
      const flexibleOfferCarousel = screen.getByText('Flexible offer carousel');
      const newsTitle = screen.getByText('Latest news');

      expect(elementIsBeneath(popularBrandsTitle, standardOfferCarousel)).toBe(true);
      expect(elementIsBeneath(flexibleOfferCarousel, newsTitle)).toBe(true);
    });
  });
});

// This test is only needed until popular brands are introduced to blc-au & dds, after that it can be deleted.
describe('Popular brands blc-aus & dds ', () => {
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
      [Experiments.POPULAR_OFFERS]: 'control',
    };
    whenHomePageIsRendered();
  });
  it('should render popular brands when home page is rendered and popular offers experiment is in control group - blc-au & dds', () => {
    const popularBrandsTitle = screen.queryByText('Popular brands');
    expect(popularBrandsTitle).not.toBeInTheDocument();
  });
});

// Utility function to determine if a selected html element appears below another
function elementIsBeneath(elementOne: HTMLElement | null, elementTwo: HTMLElement | null): boolean {
  if (!elementOne || !elementTwo) {
    throw new Error('Both elements must be present');
  }
  return !!(elementOne.compareDocumentPosition(elementTwo) & Node.DOCUMENT_POSITION_FOLLOWING);
}

const whenHomePageIsRendered = () => {
  render(
    <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, amplitudeFlagsAndExperiments]]}>
      <Home />
    </JotaiTestProvider>,
  );
};
