import { V5_API_URL } from '@/globals/apiUrl';
import { usePlatformAdapter, withClientSidePagination } from '@bluelightcard/shared-ui';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { CategoryData, PaginatedCategoryData } from '@bluelightcard/shared-ui';

// Create cache entries of paginated category data
const createPaginatedCache = (
  queryClient: QueryClient,
  categoryData: CategoryData,
  queryKey: Array<string | number>,
  pageSize: number
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
  const queryClient = useQueryClient();
  const platformAdapter = usePlatformAdapter();

  if (!categoryId || categoryId === '' || categoryId === 'undefined')
    throw new Error('Valid category ID not provided');

  const queryKey = ['categoryData', categoryId, pageSize, page];

  return useSuspenseQuery({
    queryKey,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: () =>
      // TODO: Remove client-side pagination when server-side pagination is implemented
      withClientSidePagination<CategoryData, PaginatedCategoryData>(
        queryClient,
        queryKey,
        pageSize,
        createPaginatedCache,
        async () => {
          // Should only execute request on the first call as subsequent calls should be cached pages when using client-side pagination
          const response = await platformAdapter.invokeV5Api(
            V5_API_URL.Categories + `/${categoryId}`,
            {
              method: 'GET',
              queryParameters: {
                dob: '2001-01-01',
                organisation: 'DEN',
              },
            }
          );

          if (response.status !== 200)
            throw new Error('Received error when trying to retrieve category');

          try {
            const category = JSON.parse(response?.data)?.data as CategoryData;
            return category;
          } catch (err) {
            console.error(err);
            throw new Error('Invalid category data received');
          }
        }
      ),
  });
};

export default useCategoryData;
