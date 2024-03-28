import { Brand } from '@/components/PopularBrands/types';
import useAPIData from './useAPIData';
import { APIUrl } from '@/globals';

const useRecommendedBrands = (): Brand[] => {
  return useAPIData(APIUrl.RecommendedCompanies) ?? [];
};

export default useRecommendedBrands;
