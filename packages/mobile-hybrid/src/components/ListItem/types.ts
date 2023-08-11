export interface ListItemProps {
  title: string;
  text?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  onClick?: () => void;
}
