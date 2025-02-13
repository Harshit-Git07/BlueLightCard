import { CATEGORY_ID } from '../../constants';
import { CategoriesData, SimpleCategoryData } from '../../types';
import { excludeEventCategory } from '../excludeEventCategory';

describe('excludeEventCategory', () => {
  const eventCategory: SimpleCategoryData = {
    id: CATEGORY_ID.event,
    name: 'Events',
  };

  const mockCategoriesDataWithEvents: CategoriesData = [
    {
      id: '13',
      name: 'Health and Beauty',
    },
    {
      id: '16',
      name: 'Children and Toys',
    },
    eventCategory,
  ];

  describe('when shouldIncludeEvents is true', () => {
    const shouldIncludeEvents = true;
    test('should NOT remove events category', () => {
      const transformedData = excludeEventCategory(
        mockCategoriesDataWithEvents,
        shouldIncludeEvents,
      );

      expect(transformedData).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: eventCategory.id })]),
      );
    });
  });

  describe('when shouldIncludeEvents is false', () => {
    const shouldIncludeEvents = false;
    test('should remove events category', () => {
      const transformedData = excludeEventCategory(
        mockCategoriesDataWithEvents,
        shouldIncludeEvents,
      );

      expect(transformedData).not.toContainEqual(expect.objectContaining({ id: eventCategory.id }));
    });
  });
});
