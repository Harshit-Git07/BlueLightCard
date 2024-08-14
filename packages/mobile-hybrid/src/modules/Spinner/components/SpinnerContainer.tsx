import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import SpinnerPresenter from './SpinnerPresenter';
import { spinner } from '../store';

const SPINNER_TIMEOUT = 30000;
const SPINNER_TIMEOUT_INCREMENT = 30000;
const LOADING_RETRY_COUNT_KEY = 'loading-retry-count';

function getLocalStorageItem(key: string) {
  return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
}

function setLocalStorageItem(key: string, value: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}

function removeLocalStorageItem(key: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}

const LOADING_RETRY_MESSAGES = [
  'Hang tight! The page is just taking a little longer to load due to high demand. Thanks for your patience.',
  'Oops! It looks this will still take us a little bit longer, we suggest you try again later.',
];

let timeoutId: NodeJS.Timeout | null;

function resetTimeout() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

const SpinnerContainer: FC = () => {
  const loading = useAtomValue(spinner);
  const [displayTimeoutMessage, setDisplayTimeoutMessage] = useState<string | null>();
  const [maxedRetries, setMaxedRetries] = useState(false);
  const currentLoadingValue = useRef(loading);

  const getRetryCount = useCallback(() => {
    return Number(getLocalStorageItem(LOADING_RETRY_COUNT_KEY));
  }, []);

  const getLoadingRetryMessage = useCallback(() => {
    const retryCount = getRetryCount() - 1;
    return retryCount > -1 ? LOADING_RETRY_MESSAGES[retryCount] : null;
  }, [getRetryCount]);

  const incrementRetryCount = useCallback(() => {
    const increment = getRetryCount() + 1;
    setLocalStorageItem(LOADING_RETRY_COUNT_KEY, String(increment));
  }, [getRetryCount]);

  const timeout = SPINNER_TIMEOUT + SPINNER_TIMEOUT_INCREMENT * getRetryCount();
  const lastRetry = getRetryCount() >= LOADING_RETRY_MESSAGES.length;

  useEffect(() => {
    if (loading) {
      resetTimeout();

      setDisplayTimeoutMessage(getLoadingRetryMessage());

      timeoutId = setTimeout(() => {
        if (currentLoadingValue.current && !lastRetry) {
          incrementRetryCount();
          window.location.reload();
        } else if (lastRetry) {
          removeLocalStorageItem(LOADING_RETRY_COUNT_KEY);
        }
      }, timeout);
    }
  }, [loading, timeout, lastRetry, getLoadingRetryMessage, incrementRetryCount]);

  useEffect(() => {
    currentLoadingValue.current = loading;

    if (lastRetry) {
      setMaxedRetries(true);
    }
  }, [loading, lastRetry]);

  return (
    <>
      {loading && (
        <SpinnerPresenter
          maxedRetries={maxedRetries}
          displayTimeoutMessage={displayTimeoutMessage}
        />
      )}
    </>
  );
};

export default SpinnerContainer;
