export interface ListProps {
  listVariant: ListVariant;
  entityId: number;
}

export enum ListVariant {
  Categories = 'categories',
  Types = 'types',
}
