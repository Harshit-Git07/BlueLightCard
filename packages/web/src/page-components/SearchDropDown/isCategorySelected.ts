export const isCategorySelected = (categoryId: string, pathname: string): boolean => {
  if (!pathname.startsWith('/offers.php?cat=true&type=')) {
    return false;
  }
  return pathname.includes(categoryId);
};
