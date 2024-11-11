export type Category = {
  id: number;
  name: string;
  parentCategoryIds?: number[];
  level: number;
  updatedAt: string;
};
