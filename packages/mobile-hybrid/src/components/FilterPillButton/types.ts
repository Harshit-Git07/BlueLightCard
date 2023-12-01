export type FilterPillButtonProps = {
  pills: {
    value: string;
    text: string;
  }[];
  onSelected?: (selected: string[]) => void;
};
