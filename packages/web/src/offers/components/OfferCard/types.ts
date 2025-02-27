export interface OfferCardProps {
  offerName: string;
  companyName: string;
  imageSrc: string;
  alt: string;
  offerLink: string;
  variant?: string;
  id: string;
  addBackground?: boolean;
  offerTag?: 'local offer' | 'online offer' | 'high street' | 'gift card' | number | undefined;
  withBorder?: boolean;
  upperCaseTitle?: boolean;
  showFindOutMore?: boolean;
  fallbackImage?: string;
  offerId?: number | string;
  companyId?: number | string;
  hasLink?: boolean;
  onClick?: () => void;
}

export interface OfferCardDetailsProps {
  offerName: string;
  offerLink?: string;
  showFindOutMore?: boolean;
  companyName: string;
  variant?: string;
  id?: string;
  xPaddingClassName?: string;
  offerTag?: 'local offer' | 'online offer' | 'high street' | 'gift card' | number | undefined;
  upperCaseTitle?: boolean;
}
