export type PillButtonProps = {
  pills: {
    value: string;
    text: string;
  }[];
  onSelected?: (selected: string[]) => void;
};
