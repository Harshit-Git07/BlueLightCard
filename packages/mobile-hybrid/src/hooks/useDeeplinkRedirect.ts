import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const useDeeplinkRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const deeplinkQueryParam = searchParams.get('deeplink');
    if (deeplinkQueryParam) {
      router.push(getDeeplinkRedirect(deeplinkQueryParam));
    }
  }, [router, searchParams]);
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
