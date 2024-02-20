import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useDeeplinkRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    const deeplinkQueryParam = router.query?.deeplink
      ? (router.query?.deeplink as string)
      : undefined;
    if (deeplinkQueryParam) {
      router.push(getDeeplinkRedirect(deeplinkQueryParam));
    }
  }, [router]);
};

const getDeeplinkRedirect = (sourceUri: string): string => {
  const decodedSourceUri = decodeURIComponent(sourceUri);
  const [sourcePath, queryParams] = decodedSourceUri.split('?');

  return buildRedirectPath(sourcePath, queryParams);
};

const buildRedirectPath = (sourcePath: string, originalQueryParams?: string): string => {
  const targetPath = getTargetPath(sourcePath, originalQueryParams);

  return `${targetPath}${getQueryParams(originalQueryParams)}`;
};

const getTargetPath = (sourcePath: string, queryParams?: string) => {
  const defaultTargetPath = '/search';

  if (sourcePath === '/offers.php') {
    if (queryParams?.includes('search=')) {
      return '/searchresults';
    }

    if (queryParams?.includes('cat=')) {
      return '/categories';
    }

    if (queryParams?.includes('type=')) {
      return '/types';
    }
  }
  return defaultTargetPath;
};

const getQueryParams = (originalQueryParams?: string) =>
  originalQueryParams ? `?${originalQueryParams}` : '';

export default useDeeplinkRedirect;
