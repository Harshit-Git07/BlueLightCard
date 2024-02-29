export interface CardCarouselOffer {
  offername?: string;
  companyname?: string;
  imageUrl: string;
  href: string;
  offerId?: string;
  companyId?: string;
  hasLink?: boolean;
  onClick?: () => void;
}

export interface CardCarouselProps {
  title?: string;
  itemsToShow: number;
  useSmallCards?: boolean;
  offers: CardCarouselOffer[];
}
