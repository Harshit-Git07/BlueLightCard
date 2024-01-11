import { FC } from 'react';
import { useAtomValue } from 'jotai';
import SpinnerPresenter from './SpinnerPresenter';
import { spinner } from '../store';

const SpinnerContainer: FC = () => {
  const loading = useAtomValue(spinner);

  return <>{loading && <SpinnerPresenter />}</>;
};

export default SpinnerContainer;
