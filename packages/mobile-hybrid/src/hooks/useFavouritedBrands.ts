import { FavouritedBrandsModel } from '@/models/favouritedBrand';
import useAPIData, { APIUrl } from './useAPIData';
import { Brand } from '@/components/PopularBrands/types';

const useFavouritedBrands = (): Brand[] => {
  const favouritedBrands: FavouritedBrandsModel[] = useAPIData(APIUrl.FavouritedBrands) ?? [];
  return favouritedBrands.map<Brand>((brand) => ({
    id: brand.cid,
    imageSrc: brand.logos,
    brandName: brand.companyname,
  }));
};

export default useFavouritedBrands;
