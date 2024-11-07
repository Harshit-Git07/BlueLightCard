import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { spinner } from '@/modules/Spinner/store';
import useDeeplinkRedirect from './useDeeplinkRedirect';

const useRouterReady = () => {
  const router = useRouter();
  const setSpinner = useSetAtom(spinner);

  useDeeplinkRedirect();

  useEffect(() => {
    if (router.isReady && !router.query?.deeplink) {
      setSpinner(false);
    }
  }, [router.isReady, router.query?.deeplink, setSpinner]);
};

export default useRouterReady;
