export interface CardCarouselOffer {
  offername?: string;
  companyname?: string;
  imageUrl: string;
  href: string;
}

export interface CardCarouselProps {
  title?: string;
  itemsToShow: number;
  useSmallCards?: boolean;
  offers: CardCarouselOffer[];
}
