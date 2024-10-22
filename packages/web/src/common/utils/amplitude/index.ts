import * as amplitude from '@amplitude/analytics-browser';
import { unpackJWT } from '@core/utils/unpackJWT';

import { AMPLITUDE_API_KEY, BRAND } from '@/global-vars';
import EVENTS from './events';
import { AMPLITUDE_LOG_LEVEL, AMPLITUDE_SERVER_ZONE } from '@/utils/amplitude/amplitude';

export async function initialiseAmplitude() {
  const idToken = localStorage.getItem('idToken') ?? '';
  const sessionId = sessionStorage.getItem('amplitude_session_id');

  if (idToken) {
    let { 'custom:blc_old_uuid': userId } = unpackJWT(idToken);
    userId = userId ?? null;
    amplitude.init(AMPLITUDE_API_KEY, userId, {
      serverZone: AMPLITUDE_SERVER_ZONE,
      logLevel: AMPLITUDE_LOG_LEVEL,
      transport: 'beacon',
    });
    if (sessionId) amplitude.setSessionId(Number(sessionId));
  } else {
    throw new Error('User is not authenticated. Cannot initialise Amplitude without user uuid');
  }
}

export function scrolledToBlock(scrolledPercentage: number): number {
  if (scrolledPercentage >= 0 && scrolledPercentage < 25) {
    return 25;
  } else if (scrolledPercentage >= 25 && scrolledPercentage < 50) {
    return 50;
  } else if (scrolledPercentage >= 50 && scrolledPercentage < 75) {
    return 75;
  } else if (scrolledPercentage >= 75 && scrolledPercentage <= 100) {
    return 100;
  }
  return 0;
}

export function logMembersHomePageScrollDepth(depth: number) {
  const eventProperties = {
    scroll_depth_percentage: depth,
    brand: BRAND,
  };
  amplitude.track(EVENTS.HOMEPAGE_VIEWED, eventProperties);
}

export function logMembersHomePage() {
  initialiseAmplitude();
  let scrollBlockPercentage = 0;
  let lastBlockScrolledPercentage = 25;
  logMembersHomePageScrollDepth(25);

  window.addEventListener('scroll', () => {
    const scrollDepthPercentage = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    scrollBlockPercentage = scrolledToBlock(scrollDepthPercentage);

    if (lastBlockScrolledPercentage !== scrollBlockPercentage) {
      lastBlockScrolledPercentage = scrollBlockPercentage;
      logMembersHomePageScrollDepth(scrollBlockPercentage);
    }
  });
}

export function logSearchCompanyEvent(companyId: string, companyName: string) {
  const eventProperties = {
    company_id: companyId,
    company_name: companyName,
    brand: BRAND,
  };
  amplitude.track(EVENTS.SEARCH_BY_COMPANY_STARTED, eventProperties);
}

export function logSearchCategoryEvent(categoryId: string, categoryName: string) {
  const eventProperties = {
    category_id: categoryId,
    category_name: categoryName,
    brand: BRAND,
  };
  amplitude.track(EVENTS.SEARCH_BY_CATEGORY_STARTED, eventProperties);
}

export function logSearchTermEvent(searchTerm: string) {
  const eventProperties = {
    search_term: searchTerm,
    brand: BRAND,
  };
  if (searchTerm) {
    amplitude.track(EVENTS.SEARCH_BY_PHRASE_STARTED, eventProperties);
  }
}

export function logSearchPage(searchTerm?: string, resultsCount?: number) {
  initialiseAmplitude();

  logSearchResultsViewed(searchTerm, resultsCount);
}

export function logSearchResultsViewed(searchTerm?: string, resultsCount?: number) {
  const searchResultsEvent = {
    search_term: searchTerm ?? '',
    number_of_results: resultsCount ?? 0,
    brand: BRAND,
  };
  amplitude.track(EVENTS.SEARCH_RESULTS_VIEWED, searchResultsEvent);
}

export function logSearchCardClicked(
  companyId: number | string,
  companyName: string,
  offerId: number | string,
  offerName: string,
  searchTerm: string,
  resultsCount: number,
  searchResultNumber: number
) {
  const eventProperties = {
    company_id: companyId ?? 0,
    company_name: companyName ?? '',
    offer_id: offerId ?? 0,
    offer_name: offerName ?? '',
    number_of_results: resultsCount ?? 0,
    search_term: searchTerm ?? '',
    search_result_number: searchResultNumber ?? 0,
    brand: BRAND,
  };
  amplitude.track(EVENTS.SEARCH_RESULTS_CARD_CLICKED, eventProperties);
}

export function logSerpSearchStarted(searchTerm?: string, resultsCount?: number) {
  const searchResultsEvent = {
    search_term: searchTerm ?? '',
    number_of_results: resultsCount ?? 0,
    brand: BRAND,
  };
  amplitude.track(EVENTS.SERP_SEARCH_STARTED, searchResultsEvent);
}
