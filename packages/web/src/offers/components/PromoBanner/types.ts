export interface PromoBannerProps {
  image: string;
  href: string;
  id: string;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}
