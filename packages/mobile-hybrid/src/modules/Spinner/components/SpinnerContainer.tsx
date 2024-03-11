import { FC, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import SpinnerPresenter from './SpinnerPresenter';
import { spinner } from '../store';

const SPINNER_TIMEOUT = 30000;

const SpinnerContainer: FC = () => {
  const loading = useAtomValue(spinner);
  const currentLoadingValue = useRef(loading);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        if (currentLoadingValue.current) {
          window.location.reload();
        }
      }, SPINNER_TIMEOUT);
    }
  }, [loading]);

  useEffect(() => {
    currentLoadingValue.current = loading;
  }, [loading]);

  return <>{loading && <SpinnerPresenter />}</>;
};

export default SpinnerContainer;
