export type PillButtonProps = {
  text: string;
  onSelected: () => void;
  disabled?: boolean;
  outline?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isSelected?: boolean;
};
