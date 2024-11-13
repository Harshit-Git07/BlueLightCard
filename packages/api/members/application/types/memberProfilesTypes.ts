import { Gender } from '../enums/Gender';
export interface CreateProfilePayload {
  emailAddress: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface AddressInsertPayload {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  county: string;
  postcode: string;
}
