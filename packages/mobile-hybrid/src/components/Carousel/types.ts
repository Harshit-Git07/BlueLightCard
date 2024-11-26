export interface CardCarouselProps<T> {
  slides: Slide<T>[];
  onSlideItemClick?: (slide: Slide<T>) => void;
  onSlideChanged?: (index: number) => void;
}

export interface Slide<T> {
  id: number | string;
  text?: string;
  title?: string;
  imageSrc: string;
  meta: T;
}
