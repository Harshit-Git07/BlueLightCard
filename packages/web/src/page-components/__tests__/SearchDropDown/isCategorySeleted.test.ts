import { isCategorySelected } from '../../SearchDropDown/isCategorySelected';

describe('isCategorySelected', () => {
  const mockCategoryId = 'mockCategoryId';
  const testCase = [
    { result: false, categoryId: '1', url: `/offers.php?cat=true&type=${mockCategoryId}` },
    { result: false, categoryId: '1', url: `/type=${mockCategoryId}` },
    { result: false, categoryId: '1', url: `/${mockCategoryId}` },
    {
      result: true,
      categoryId: mockCategoryId,
      url: `/offers.php?cat=true&type=${mockCategoryId}`,
    },
  ];
  it.each(testCase)(
    `should return true if categoryid is within the url and the url is correct`,
    ({ result, categoryId, url }) => {
      expect(isCategorySelected(categoryId, url)).toBe(result);
    }
  );
});
