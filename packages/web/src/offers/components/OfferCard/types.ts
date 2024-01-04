export interface OfferCardProps {
  offerName: string;
  companyName: string;
  imageSrc: string;
  alt: string;
  offerLink: string;
  variant?: string;
  id?: string;
  addBackground?: boolean;
  offerTag?: 'local offer' | 'online offer' | 'high street' | 'gift card' | number | undefined;
}

export interface OfferCardDetailsProps {
  offerName: string;
  offerLink?: string;
  companyName: string;
  variant?: string;
  id?: string;
  xPaddingClassName?: string;
  offerTag?: 'local offer' | 'online offer' | 'high street' | 'gift card' | number | undefined;
}
