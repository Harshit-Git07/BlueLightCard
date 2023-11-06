import { FavouritedBrandsModel } from '@/models/favouritedBrand';
import useAPIData, { APIUrl } from './useAPIData';

const useFavouritedBrands = (): FavouritedBrandsModel[] => {
  return useAPIData(APIUrl.FavouritedBrands) ?? [];
};

export default useFavouritedBrands;
