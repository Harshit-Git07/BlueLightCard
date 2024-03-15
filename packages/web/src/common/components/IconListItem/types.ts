export type IconListItemProps = {
  iconSrc?: string;
  emoji?: string;
  title: string;
  link?: string;
  onClickLink?: () => void;
  href?: string;
  useLegacyRouting?: boolean;
};
