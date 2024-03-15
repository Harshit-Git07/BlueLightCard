export interface LinkProps {
  useLegacyRouting?: boolean;
  href?: string;
  children?: React.ReactNode[] | React.ReactNode;
  onClickLink?: () => void;
  [key: string]: any;
}
