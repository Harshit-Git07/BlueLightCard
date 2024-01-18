export interface BrowseCategoriesProps {
  categories: Category[];
  onCategoryClick: (data: number) => void;
}

export interface Category {
  id: number;
  text: string;
}
