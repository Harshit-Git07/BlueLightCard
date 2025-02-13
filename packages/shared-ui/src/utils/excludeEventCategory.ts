import { CATEGORY_ID } from '../constants';
import { CategoriesData } from '../types';

export function excludeEventCategory(
  data: CategoriesData,
  shouldIncludeEvents: boolean,
): CategoriesData {
  if (shouldIncludeEvents) {
    return data;
  }

  return data.filter(({ id }) => id !== CATEGORY_ID.event);
}
