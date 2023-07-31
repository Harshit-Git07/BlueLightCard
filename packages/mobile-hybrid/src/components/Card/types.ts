export enum CardLayout {
  ImageTop = 'imageTop',
  ImageLeft = 'imageLeft',
}

export interface CardProps {
  title?: string;
  text: string;
  textAlign?: 'text-center' | 'text-left' | 'text-right';
  imageSrc?: string;
  imageAlt?: string;
  imageSizes?: string;
  imageHeight?: number;
  imageWidth?: number;
  layout?: CardLayout;
  selected?: boolean;
  onClick?: (isSelected: boolean) => void;
}
