import * as amplitude from '@amplitude/analytics-browser';
import { unpackJWT } from '@core/utils/unpackJWT';

import { AMPLITUDE_API_KEY } from '@/global-vars';
import EVENTS from './events';

export function initialiseAmplitude() {
  const idToken = localStorage.getItem('idToken');

  if (idToken) {
    let { 'custom:blc_old_uuid': userId } = unpackJWT(idToken);
    userId = userId ?? null;
    amplitude.init(AMPLITUDE_API_KEY, userId, {
      serverZone: 'EU',
      logLevel: amplitude.Types.LogLevel.Warn,
    });
  } else {
    throw new Error('User is not authenticated. Cannot initialise Amplitude without user uuid');
  }
}

function scrolledToBlock(scrolledPercentage: number): number {
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

function logMembersHomePageScrollDepth(depth: number) {
  const eventProperties = {
    scroll_depth_percentage: depth,
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

export async function logSearchCompanyEvent(companyId: string, companyName: string) {
  const eventProperties = {
    company_id: companyId,
    company_name: companyName,
  };
  await amplitude.track(EVENTS.SEARCH_BY_COMPANY_STARTED, eventProperties).promise;
}

export async function logSearchCategoryEvent(categoryId: string, categoryName: string) {
  const eventProperties = {
    category_id: categoryId,
    category_name: categoryName,
  };
  await amplitude.track(EVENTS.SEARCH_BY_CATEGORY_STARTED, eventProperties).promise;
}

export async function logSearchTermEvent(searchTerm: string) {
  const eventProperties = {
    search_term: searchTerm,
  };
  if (searchTerm) {
    await amplitude.track(EVENTS.SEARCH_BY_PHRASE_STARTED, eventProperties).promise;
  }
}

export async function logSearchPage(searchTerm?: string, resultsCount?: number) {
  initialiseAmplitude();

  await logSearchResultsViewed(searchTerm, resultsCount);
}

export async function logSearchResultsViewed(searchTerm?: string, resultsCount?: number) {
  const searchResultsEvent = {
    search_term: searchTerm ?? '',
    number_of_results: resultsCount ?? 0,
  };
  await amplitude.track(EVENTS.SEARCH_RESULTS_VIEWED, searchResultsEvent).promise;
}

export async function logSerpSearchStarted(searchTerm?: string, resultsCount?: number) {
  const searchResultsEvent = {
    search_term: searchTerm ?? '',
    number_of_results: resultsCount ?? 0,
  };
  await amplitude.track(EVENTS.SERP_SEARCH_STARTED, searchResultsEvent).promise;
}
