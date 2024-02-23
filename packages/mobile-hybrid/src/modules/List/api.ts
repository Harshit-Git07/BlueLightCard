import { APIUrl } from '@/globals';
import { ListVariant } from './types';

export const apiMap = { categories: APIUrl.List, types: APIUrl.List };
export const variantToQueryParam = {
  [ListVariant.Categories]: 'catid',
  [ListVariant.Types]: 'typeid',
};
