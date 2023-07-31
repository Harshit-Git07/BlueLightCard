export interface BannerCarouselProps {
  slides: Slide[];
}

export interface Slide {
  text: string;
  title?: string;
  imageSrc: string;
}
