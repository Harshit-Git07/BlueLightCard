export enum InfoCardLayout {
  ImageTop = 'imageTop',
  ImageLeft = 'imageLeft',
}

export interface InfoCardProps {
  title?: string;
  text: string;
  textAlign?: 'text-center' | 'text-left' | 'text-right';
  imageSrc?: string;
  imageAlt?: string;
  imageSizes?: string;
  imageHeight?: number;
  imageWidth?: number;
  layout?: InfoCardLayout;
  selected?: boolean;
  className?: string;
  onClick?: (isSelected: boolean) => void;
}
