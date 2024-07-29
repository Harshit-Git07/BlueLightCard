export type TextListItemProps = {
  variant: 'default' | 'clickable';
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};
