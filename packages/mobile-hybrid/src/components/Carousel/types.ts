export interface CardCarouselProps {
  slides: Slide[];
  onSlideItemClick?: (data: any) => void;
}

export interface Slide {
  id: number;
  text?: string;
  title?: string;
  imageSrc: string;
}
