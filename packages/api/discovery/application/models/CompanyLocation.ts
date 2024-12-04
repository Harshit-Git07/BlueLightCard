export type Geopoint = {
  lat: number;
  lon: number;
};

// What should be mandatory with a company location?
export type CompanyLocation = {
  id: string;
  type: 'company-location';
  companyId: string;
  updatedAt: string;
  location: Geopoint;
  storeName?: string;
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  region?: string;
  postcode?: string;
  country?: 'UK' | 'AU';
  telephone?: string;
  totalBatches: number;
  batchIndex: number;
};

export type CompanyLocationEvent = {
  companyId: string;
  updatedAt: string;
  totalBatches: number;
  batchIndex: number;
  locations: CompanyLocation[];
};
