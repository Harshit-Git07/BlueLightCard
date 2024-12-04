export interface PromoBannerProps {
  image: string;
  href: string;
  id: string;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export interface PromoBannerPlaceholderProps {
  variant?: 'large' | 'small';
}
