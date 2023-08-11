export interface BannerCarouselProps {
  slides: Slide[];
  onSlideItemClick?: (data: any) => void;
  onSlideChanged?: (index: number) => void;
}

export interface Slide {
  id: number;
  text: string;
  title?: string;
  imageSrc: string;
}
