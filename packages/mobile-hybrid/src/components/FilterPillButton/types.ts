export type OnFiltersCallback = (selected: string) => void;

export type FilterPillButtonProps = {
  pills: {
    value: string;
    text: string;
  }[];
  selected: string[];
  onSelected?: OnFiltersCallback;
  onDeselected?: OnFiltersCallback;
};
