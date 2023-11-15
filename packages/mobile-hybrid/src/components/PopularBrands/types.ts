export interface PopularBrandsProps {
  rounded?: boolean;
  title: string;
  brands: Brand[];
  text?: string;
  onBrandItemClick?: (data: any) => void;
  onInteracted?: () => void;
}

export interface Brand {
  id: number;
  imageSrc: string;
  brandName: string;
}
