export type OfferCardListProps = {
  status: 'loading' | 'error' | 'success';
  onOfferClick: (offer: {
    id: number;
    CompID: number;
    CompanyName: string;
    OfferType: number;
    OfferName: string;
    imageSrc: string;
  }) => void;
  offers: Offer[];
  columns?: number;
  variant?: 'vertical' | 'horizontal';
};

export type Offer = {
  id: number;
  CompID: number;
  CompanyName: string;
  OfferType: number;
  OfferName: string;
  imageSrc: string;
};
