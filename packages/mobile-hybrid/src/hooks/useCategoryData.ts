import { V5_API_URL } from '@/globals';
import {
  isEventCategoryData,
  mapCategoryEventsToOffers,
  usePlatformAdapter,
  withClientSidePagination,
} from '@bluelightcard/shared-ui';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { CategoryData, PaginatedCategoryData } from '@bluelightcard/shared-ui';
import { useAtomValue } from 'jotai';
import { experimentsAndFeatureFlags, FeatureFlags } from '@/components/AmplitudeProvider';

// Create cache entries of paginated category data
const createPaginatedCache = (
  queryClient: QueryClient,
  categoryData: CategoryData,
  queryKey: Array<string | number>,
  pageSize: number,
) => {
  const totalPages = Math.ceil(categoryData.data.length / pageSize);

  // If there's no data just set the first page as the raw result and exit early
  if (totalPages == 0) {
    queryClient.setQueryData(queryKey, {
      ...categoryData,
      meta: {
        totalPages: 1,
      },
    });
    return;
  }

  const clonedQueryKey = [...queryKey];
  clonedQueryKey.pop();

  for (const pageNumber of Array.from({ length: totalPages }, (_, index) => index + 1)) {
    const page = categoryData.data.splice(0, pageSize);
    queryClient.setQueryData([...clonedQueryKey, pageNumber], {
      ...categoryData,
      data: page,
      meta: {
        totalPages,
      },
    });
  }
};

const useCategoryData = (categoryId: string, page: number, pageSize: number) => {
  const experimentsAndFlags = useAtomValue(experimentsAndFeatureFlags);
  const queryClient = useQueryClient();
  const platformAdapter = usePlatformAdapter();

  const v5Flag = experimentsAndFlags[FeatureFlags.V5_API_INTEGRATION] ?? 'off';

  if (!categoryId || categoryId === '' || categoryId === 'undefined')
    throw new Error('Valid category ID not provided');

  const queryKey = ['categoryData', categoryId, pageSize, `v5-${v5Flag}`, page];

  return useSuspenseQuery({
    queryKey,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: () =>
      withClientSidePagination<CategoryData, PaginatedCategoryData>(
        queryClient,
        queryKey,
        pageSize,
        createPaginatedCache,
        async () => {
          if (v5Flag !== 'on') {
            return {
              id: '',
              name: '',
              data: [],
            };
          }

          // Should only execute request on the first call as subsequent calls should be cached pages when using client-side pagination
          const response = await platformAdapter.invokeV5Api(
            V5_API_URL.Categories + `/${categoryId}`,
            {
              method: 'GET',
            },
          );

          if (response.status !== 200)
            throw new Error('Received error when trying to retrieve category', {
              cause: { code: 'InvalidResponseStatus', response },
            });

          try {
            let category: unknown = JSON.parse(response?.data)?.data;
            if (isEventCategoryData(category)) {
              category = mapCategoryEventsToOffers(category);
            }
            return category as CategoryData;
          } catch (err) {
            throw (
              (new Error('Invalid category data received'),
              { cause: { code: 'InvalidResponse', err, response } })
            );
          }
        },
      ),
  });
};

export default useCategoryData;
