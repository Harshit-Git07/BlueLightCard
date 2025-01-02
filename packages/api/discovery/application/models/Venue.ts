import { Category } from './Category';

export type Venue = {
  id: string;
  name: string;
  logo: string;
  categories: Category[];
  updatedAt: string;
  venueDescription: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  region?: string;
  postcode?: string;
  telephone?: string;
};
