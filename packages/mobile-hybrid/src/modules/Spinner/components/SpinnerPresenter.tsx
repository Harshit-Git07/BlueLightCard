import Spinner from '@/components/Spinner/Spinner';
import { FC } from 'react';

const SpinnerPresenter: FC = () => {
  return (
    <div className="fixed top-0 flex z-20 items-center justify-center w-full h-full bg-white dark:bg-neutral-800">
      <Spinner />
    </div>
  );
};

export default SpinnerPresenter;
