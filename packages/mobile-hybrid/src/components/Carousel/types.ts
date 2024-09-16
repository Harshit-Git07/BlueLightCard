export interface CardCarouselProps {
  slides: Slide[];
  onSlideItemClick?: (data: any) => void;
  onSlideChanged?: (index: number) => void;
}

export interface Slide {
  id: number;
  offerId?: number;
  text?: string;
  title?: string;
  imageSrc: string;
}
