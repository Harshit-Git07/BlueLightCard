import { lazy, Suspense } from 'react';
import { useFuzzyFrontendListener } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/hooks/UseFuzzyFrontendListener';

const LazyLoader = lazy(
  () => import('@bluelightcard/shared-ui/components/MyAccountDebugTools/index')
);

const MyAccountDebugToolsLazily = () => {
  const isFuzzy = useFuzzyFrontendListener();
  const isSafe = ['staging', 'preview'].includes(process.env.NEXT_PUBLIC_ENV ?? '') && isFuzzy;
  if (!isSafe) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyLoader />
    </Suspense>
  );
};

export default MyAccountDebugToolsLazily;
