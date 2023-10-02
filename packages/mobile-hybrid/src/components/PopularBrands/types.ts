export interface PopularBrandsProps {
  brands: Brand[];
  text?: string;
  onBrandItemClick?: (data: any) => void;
}

export interface Brand {
  id: number;
  imageSrc: string;
  altText: string;
}
