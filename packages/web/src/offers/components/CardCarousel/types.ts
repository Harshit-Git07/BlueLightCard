export interface CardCarouselOffer {
  offername?: string;
  companyname?: string;
  imageUrl: string;
  href: string;
  offerId?: number;
  companyId?: number;
  hasLink?: boolean;
  onClick?: () => void;
}

export interface CardCarouselProps {
  title?: string;
  itemsToShow: number;
  useSmallCards?: boolean;
  offers: CardCarouselOffer[];
  opensOffersheet?: boolean;
}
