import { FavouritedBrandsModel } from '@/models/favouritedBrand';
import { Brand } from '@/components/PopularBrands/types';
import { APIUrl } from '@/globals';
import useAPI, { APIResponse } from './useAPI';

const useFavouritedBrands = (): Brand[] => {
  const response = useAPI(APIUrl.FavouritedBrands) as APIResponse<FavouritedBrandsModel[]>;
  if (response?.data) {
    return response.data.map<Brand>((brand) => ({
      id: brand.cid,
      imageSrc: brand.logos,
      brandName: brand.companyname,
    }));
  }
  return [];
};

export default useFavouritedBrands;
