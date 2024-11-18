export interface CardCarouselOffer {
  offername?: string;
  companyname?: string;
  imageUrl: string;
  href: string;
  offerId?: number | string;
  companyId?: number | string;
  hasLink?: boolean;
  onClick?: () => void;
}

export interface CardCarouselProps {
  title?: string;
  itemsToShow: number;
  useSmallCards?: boolean;
  offers: CardCarouselOffer[];
}
