import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl, Channels } from '@/globals';
import eventBus from '@/eventBus';
import { render, screen } from '@testing-library/react';
import RecommendedBrandsSlider from '@/modules/recommendedbrands';
import { Brand } from '@/components/PopularBrands/types';
import '@testing-library/jest-dom/extend-expect';
import InvokeNativeAnalytics from '@/invoke/analytics';
import userEvent, { UserEvent } from '@testing-library/user-event';
import useRecommendedBrands from '@/hooks/useRecommendedBrands';
import InvokeNativeNavigation from '@/invoke/navigation';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');
jest.mock('@/invoke/navigation');
jest.mock('@/hooks/useRecommendedBrands');

const recommendedBrandList: Brand[] = [
  { id: 1, brandName: 'Nike', imageSrc: '' },
  { id: 2, brandName: 'Adidas', imageSrc: '' },
  { id: 3, brandName: 'New Balance', imageSrc: '' },
];

const useRecommendedBrandsMock = jest.mocked(useRecommendedBrands);

describe('RecommendedBrandsSlider', () => {
  let bus = eventBus();
  let analyticsMock: jest.SpyInstance<void, [properties: NativeAnalytics.Parameters], any>;
  let navigateMock: jest.SpyInstance<void, [url: string, domain: string], any>;
  let requestDataMock: jest.SpyInstance<
    void,
    [url: string, queryParams?: Record<string, any> | undefined],
    any
  >;
  let user: UserEvent;

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    analyticsMock = jest
      .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    navigateMock = jest
      .spyOn(InvokeNativeNavigation.prototype, 'navigate')
      .mockImplementation(() => jest.fn());
    requestDataMock = jest
      .spyOn(InvokeNativeAPICall.prototype, 'requestData')
      .mockImplementation(() => jest.fn());
    user = userEvent.setup();
  });

  describe('request recommended brands', () => {
    it('should request recommended brands on render', async () => {
      givenRecommendedBrandsAreReturnedFromTheAPI(recommendedBrandList);

      whenTheRecommendedBrandsSliderIsRendered();

      expect(requestDataMock).toHaveBeenCalledTimes(1);
      expect(requestDataMock).toHaveBeenCalledWith(APIUrl.RecommendedCompanies);
    });
  });

  describe('display recommended brands', () => {
    it('should show recommended brands slider when list of brands returned', () => {
      givenRecommendedBrandsAreReturnedFromTheAPI(recommendedBrandList);

      whenTheRecommendedBrandsSliderIsRendered();

      expect(screen.queryByAltText('Nike')).toBeInTheDocument();
      expect(screen.queryByAltText('Adidas')).toBeInTheDocument();
      expect(screen.queryByAltText('New Balance')).toBeInTheDocument();
    });

    it('should NOT show recommended brands when empty list returned', () => {
      givenRecommendedBrandsAreReturnedFromTheAPI([]);

      whenTheRecommendedBrandsSliderIsRendered();

      expect(screen.queryByAltText('Nike')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Adidas')).not.toBeInTheDocument();
      expect(screen.queryByAltText('New Balance')).not.toBeInTheDocument();
    });
  });

  describe('navigate', () => {
    it('should navigate to brand page on brand click', async () => {
      givenRecommendedBrandsAreReturnedFromTheAPI(recommendedBrandList);

      whenTheRecommendedBrandsSliderIsRendered();
      await andTheBrandItemIsClicked('Nike');

      expect(navigateMock).toHaveBeenCalledWith('/offerdetails.php?cid=1', 'home');
    });
  });

  describe('analytics', () => {
    it('should record analytics event on brand click', async () => {
      givenRecommendedBrandsAreReturnedFromTheAPI(recommendedBrandList);

      whenTheRecommendedBrandsSliderIsRendered();
      await andTheBrandItemIsClicked('Nike');

      expect(analyticsMock).toHaveBeenCalledWith({
        event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
        parameters: {
          carousel_name: 'Recommended brands',
          brand_name: 'Nike',
        },
      });
    });
  });

  const givenRecommendedBrandsAreReturnedFromTheAPI = (recommendedBrands: Brand[]) => {
    useRecommendedBrandsMock.mockReturnValue(recommendedBrands);
  };

  const whenTheRecommendedBrandsSliderIsRendered = () => {
    render(<RecommendedBrandsSlider />);
  };

  const andTheBrandItemIsClicked = async (brandName: string) => {
    const brandItem = screen.getByAltText(brandName);
    await user.click(brandItem);
  };
});
