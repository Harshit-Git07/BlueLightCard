import { UseQueryResult, useQuery } from '@tanstack/react-query';

export type useQueryOptions = {
  [key: string]: number | string | string[] | boolean | any;
  queryKeyArr: string[];
  queryFnCall: () => Promise<Record<string, any>>;
};

export function useQueryCustomHook(options: useQueryOptions): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: options.queryKeyArr,
    queryFn: options.queryFnCall,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
}
