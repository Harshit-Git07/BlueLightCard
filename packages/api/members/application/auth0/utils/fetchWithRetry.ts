import fetch_retry from 'fetch-retry';

const originalFetch = global.fetch;

export const fetchWithRetry = fetch_retry(originalFetch, {
  retries: 3,
  retryOn: function (attempt, error, response) {
    return !!(response && (error !== null || response.status == 429 || response.status >= 500));
  },
  retryDelay: function (attempt) {
    return Math.pow(2, attempt) * 1000;
  },
});
