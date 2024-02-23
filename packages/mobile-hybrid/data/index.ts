import { ListVariant } from '@/modules/List/types';
import BrowseCategoriesData from './BrowseCategories';
import BrowseTypesData from './BrowseTypes';
import { OfferListDataType } from './types';

export const offerListDataMap: Record<ListVariant, OfferListDataType[]> = {
  categories: BrowseCategoriesData,
  types: BrowseTypesData,
};
