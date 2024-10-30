import * as amplitude from '@amplitude/analytics-browser';
import * as target from '../index';
import jwt_decode from 'jwt-decode';
import EVENTS from '../../amplitude/events';
import {
  logMembersHomePageScrollDepth,
  logSearchTermEvent,
  logSearchCompanyEvent,
  logSearchCategoryEvent,
  logSearchResultsViewed,
  logSerpSearchStarted,
  logSearchCardClicked,
  logMembersHomePage,
  logSearchPage,
  scrolledToBlock,
} from '../../amplitude/index';

const mockedUserId = '1234';
const deviceId = 'deviceId';

jest.mock('jwt-decode');
jest.mock('@amplitude/analytics-browser');
jest.mock('@/global-vars', () => ({
  AMPLITUDE_API_KEY: 'API_KEY',
  BRAND: 'blc-uk',
}));

const jwtDecodeMock = jest.mocked(jwt_decode);
const amplitudeMock = jest.mocked(amplitude);

describe('Initialise Amplitude', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('When an "idToken" exists in local storage', () => {
    beforeEach(() => {
      localStorage.setItem('deviceFingerprint', deviceId);
      localStorage.setItem('idToken', 'validIdToken');
      jwtDecodeMock.mockReturnValue({ 'custom:blc_old_uuid': mockedUserId } as any);
      amplitudeMock.init.mockReturnValue({ promise: Promise.resolve() });
      amplitudeMock.setSessionId.mockReturnValue();
    });

    it('should initialise amplitude if "idToken" exists', () => {
      target.initialiseAmplitude();

      expect(amplitudeMock.init).toHaveBeenCalledWith('API_KEY', mockedUserId, {
        deviceId: deviceId,
        serverZone: 'EU',
        logLevel: amplitude.Types.LogLevel.Warn,
        transport: 'beacon',
      });
    });

    it('should call set session id with the session id', () => {
      sessionStorage.setItem('amplitude_session_id', '5678');

      target.initialiseAmplitude();

      expect(amplitudeMock.setSessionId).toHaveBeenCalledWith(5678);
    });
    it('should initialize amplitude and log initial scroll depth', () => {
      const BRAND = 'blc-uk';

      logMembersHomePage();

      expect(amplitude.track).toHaveBeenCalledWith(EVENTS.HOMEPAGE_VIEWED, {
        scroll_depth_percentage: 25,
        brand: BRAND,
      });
    });

    it('should initialise amplitude and log search results viewed', () => {
      const searchTerm = 'test search';
      const resultsCount = 10;

      logSearchPage(searchTerm, resultsCount);

      expect(amplitude.track).toHaveBeenNthCalledWith(1, 'homepage_viewed', {
        scroll_depth_percentage: 25,
        brand: 'blc-uk',
      });

      expect(amplitude.track).toHaveBeenNthCalledWith(2, 'search_results_list_viewed', {
        search_term: searchTerm,
        number_of_results: resultsCount,
        brand: 'blc-uk',
      });
    });
  });

  it('should call logSearchTermEvent with correct parameters when searchTerm is provided', () => {
    const searchTerm = 'test';
    const eventProperties = {
      search_term: searchTerm,
      brand: 'blc-uk',
    };
    const trackMock = jest.spyOn(amplitude, 'track');

    logSearchTermEvent(searchTerm);

    expect(trackMock).toHaveBeenCalledWith(EVENTS.SEARCH_BY_PHRASE_STARTED, eventProperties);
  });

  it('should call logSearchCompanyEvent with the correct event name and properties', () => {
    const companyId = '123';
    const companyName = 'Test Company';
    const BRAND = 'blc-uk';

    const trackMock = jest.spyOn(amplitude, 'track');

    logSearchCompanyEvent(companyId, companyName);

    expect(trackMock).toHaveBeenCalledWith(EVENTS.SEARCH_BY_COMPANY_STARTED, {
      company_id: companyId,
      company_name: companyName,
      brand: BRAND,
    });
  });

  it('should call logSearchCategoryEvent with the correct event name and properties', () => {
    const categoryId = '456';
    const categoryName = 'Test Category';
    const BRAND = 'blc-uk';

    logSearchCategoryEvent(categoryId, categoryName);

    expect(amplitude.track).toHaveBeenCalledWith(EVENTS.SEARCH_BY_CATEGORY_STARTED, {
      category_id: categoryId,
      category_name: categoryName,
      brand: BRAND,
    });
  });

  it('should call logSearchResultsViewed with the correct event name and properties when searchTerm and resultsCount are provided', () => {
    const searchTerm = 'test search';
    const resultsCount = 10;
    const BRAND = 'blc-uk';

    logSearchResultsViewed(searchTerm, resultsCount);

    expect(amplitude.track).toHaveBeenCalledWith(EVENTS.SEARCH_RESULTS_VIEWED, {
      search_term: searchTerm,
      number_of_results: resultsCount,
      brand: BRAND,
    });
  });

  it('should call logSearchResultsViewed with the correct value for search_term and number_of_results', () => {
    const searchTerm = 'test search';
    const resultsCount = 10;
    const BRAND = 'blc-uk';

    const trackMock = jest.spyOn(amplitude, 'track');

    logSearchResultsViewed(searchTerm, resultsCount);

    const call = trackMock.mock.calls.find((call) => call[0] === EVENTS.SEARCH_RESULTS_VIEWED);

    expect(call).toEqual([
      EVENTS.SEARCH_RESULTS_VIEWED,
      expect.objectContaining({
        search_term: searchTerm,
        number_of_results: resultsCount,
        brand: BRAND,
      }),
    ]);
  });

  it('should call logSearchResultsViewed with default values when searchTerm and resultsCount are not provided', () => {
    const BRAND = 'blc-uk';

    logSearchResultsViewed();

    expect(amplitude.track).toHaveBeenCalledWith(EVENTS.SEARCH_RESULTS_VIEWED, {
      search_term: '',
      number_of_results: 0,
      brand: BRAND,
    });
  });

  it('should call logSerpSearchStarted with the correct event name and properties when searchTerm and resultsCount are provided', () => {
    const searchTerm = 'test search';
    const resultsCount = 10;
    const BRAND = 'blc-uk';

    logSerpSearchStarted(searchTerm, resultsCount);

    expect(amplitude.track).toHaveBeenCalledWith(EVENTS.SERP_SEARCH_STARTED, {
      search_term: searchTerm,
      number_of_results: resultsCount,
      brand: BRAND,
    });
  });

  it('should call logSearchTermEvent with the correct event name and properties when searchTerm is provided', () => {
    const searchTerm = 'test';
    const BRAND = 'blc-uk';

    logSearchTermEvent(searchTerm);

    const trackMock = jest.spyOn(amplitude, 'track');
    const call = trackMock.mock.calls.find((call) => call[0] === EVENTS.SEARCH_BY_PHRASE_STARTED);

    expect(call).toEqual([
      EVENTS.SEARCH_BY_PHRASE_STARTED,
      {
        search_term: searchTerm,
        brand: BRAND,
      },
    ]);
  });

  it('should call logSearchCardClicked with the correct event name and properties', () => {
    const companyId = 1;
    const companyName = 'Test Company';
    const offerId = 2;
    const offerName = 'Test Offer';
    const searchTerm = 'test search';
    const resultsCount = 10;
    const searchResultNumber = 3;
    const BRAND = 'blc-uk';

    logSearchCardClicked(
      companyId,
      companyName,
      offerId,
      offerName,
      searchTerm,
      resultsCount,
      searchResultNumber
    );

    expect(amplitude.track).toHaveBeenCalledWith(EVENTS.SEARCH_RESULTS_CARD_CLICKED, {
      company_id: companyId,
      company_name: companyName,
      offer_id: offerId,
      offer_name: offerName,
      number_of_results: resultsCount,
      search_term: searchTerm,
      search_result_number: searchResultNumber,
      brand: BRAND,
    });
  });
});

describe('scrolledToBlock function', () => {
  it('should return 25 for scrolledPercentage between 0 and 24', () => {
    [0, 10, 24].forEach((percentage) => {
      expect(scrolledToBlock(percentage)).toBe(25);
    });
  });

  it('should return 50 for scrolledPercentage between 25 and 49', () => {
    [25, 30, 49].forEach((percentage) => {
      expect(scrolledToBlock(percentage)).toBe(50);
    });
  });

  it('should return 75 for scrolledPercentage between 50 and 74', () => {
    [50, 60, 74].forEach((percentage) => {
      expect(scrolledToBlock(percentage)).toBe(75);
    });
  });

  it('should return 100 for scrolledPercentage between 75 and 100', () => {
    [75, 85, 100].forEach((percentage) => {
      expect(scrolledToBlock(percentage)).toBe(100);
    });
  });

  it('should return 0 for scrolledPercentage outside 0 to 100', () => {
    [-1, 101].forEach((percentage) => {
      expect(scrolledToBlock(percentage)).toBe(0);
    });
  });
});

describe('trackHomepageCarouselInteraction', () => {
  it('should call amplitude.track with the correct parameters', () => {
    const carouselType = 'deals_of_the_week';
    const carouselName = 'Deals of the Week';

    const trackMock = jest.spyOn(amplitude, 'track');

    target.trackHomepageCarouselInteraction(carouselType, carouselName);

    expect(trackMock).toHaveBeenCalledWith('homepage_carousel_interacted', {
      brand: 'blc-uk',
      platform: 'web',
      carousel_type: carouselType,
      carousel_name: carouselName,
    });
  });

  it('should log an error if amplitude.track throws an error', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    const trackMock = jest.spyOn(amplitude, 'track').mockImplementation(() => {
      throw new Error('Track error');
    });

    target.trackHomepageCarouselInteraction('carouselType', 'carouselName');

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error tracking homepage_carousel_interacted:',
      expect.any(Error)
    );

    trackMock.mockRestore();
    consoleErrorMock.mockRestore();
  });
});

describe('trackHomepageCarouselClick', () => {
  it('should call amplitude.track with the correct parameters', () => {
    const carouselType = 'deals_of_the_week';
    const carouselName = 'Deals of the Week';
    const offerId = 123;
    const companyId = 456;
    const companyName = 'Test Company';

    const trackMock = jest.spyOn(amplitude, 'track');

    target.trackHomepageCarouselClick(carouselType, carouselName, offerId, companyId, companyName);

    expect(trackMock).toHaveBeenCalledWith('homepage_carousel_card_clicked', {
      brand: 'blc-uk',
      platform: 'web',
      carousel_type: carouselType,
      carousel_name: carouselName,
      company_id: companyId,
      brand_name: companyName,
      brand_offer: offerId,
    });
  });

  it('should log an error if amplitude.track throws an error', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    const trackMock = jest.spyOn(amplitude, 'track').mockImplementation(() => {
      throw new Error('Track error');
    });

    target.trackHomepageCarouselClick('carouselType', 'carouselName', 123, 456, 'Test Company');

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error tracking homepage_carousel_card_clicked:',
      expect.any(Error)
    );

    trackMock.mockRestore();
    consoleErrorMock.mockRestore();
  });
});

describe('trackTenancyClick', () => {
  it('should call amplitude.track with the correct parameters', () => {
    const tenancyType = 'takeover_banner';
    const link = 'https://example.com';

    const trackMock = jest.spyOn(amplitude, 'track');

    target.trackTenancyClick(tenancyType, link);

    expect(trackMock).toHaveBeenCalledWith('tenancy_clicked', {
      brand: 'blc-uk',
      platform: 'web',
      tenancyType: tenancyType,
      link: link,
    });
  });

  it('should log an error if amplitude.track throws an error', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    const trackMock = jest.spyOn(amplitude, 'track').mockImplementation(() => {
      throw new Error('Track error');
    });

    target.trackTenancyClick('tenancyType', 'https://example.com');

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error tracking tenancy_clicked:',
      expect.any(Error)
    );

    trackMock.mockRestore();
    consoleErrorMock.mockRestore();
  });
});
