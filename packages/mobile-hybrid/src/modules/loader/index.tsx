import Spinner from '@/components/Spinner/Spinner';
import { AppContext } from '@/store';
import { FC, useContext } from 'react';

const Loader: FC = () => {
  const { loading } = useContext(AppContext);
  const apisLoading = Object.values(loading).find((v) => !!v);
  return (
    <>
      {apisLoading && (
        <div className="fixed top-0 flex z-20 items-center justify-center w-full h-full bg-white dark:bg-neutral-800">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default Loader;
