import NextImage from 'next/image';
import Spinner from '@/components/Spinner/Spinner';
import { FC } from 'react';

export type Props = {
  maxedRetries?: boolean;
  displayTimeoutMessage?: string | null;
};

const SpinnerPresenter: FC<Props> = ({ displayTimeoutMessage, maxedRetries }) => {
  return (
    <div className="fixed top-0 flex z-20 flex-col items-center justify-center w-full h-full bg-white dark:bg-neutral-800 text-colour-onSurface dark:text-colour-onSurface-dark">
      {displayTimeoutMessage && (
        <p className="max-w-[70%] text-center mb-3">{displayTimeoutMessage}</p>
      )}
      {!maxedRetries && <Spinner />}
      {maxedRetries && (
        <NextImage
          src="/maintenance_plain.svg"
          alt="Maintenance"
          width={150}
          height={150}
          fetchPriority="auto"
        />
      )}
    </div>
  );
};

export default SpinnerPresenter;
