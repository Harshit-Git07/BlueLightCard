export interface OfferCardProps {
  offerName: string;
  companyName: string;
  imageSrc: string;
  alt: string;
  offerLink: string;
  variant?: string;
  id?: string;
  addBackground?: boolean;
}

export interface OfferCardDetailsProps {
  offerName: string;
  offerLink?: string;
  companyName: string;
  variant?: string;
  id?: string;
  xPaddingClassName?: string;
}
