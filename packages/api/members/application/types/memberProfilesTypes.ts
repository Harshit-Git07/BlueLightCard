export interface ProfileUpdatePayload {
  firstName: string;
  surname: string;
  dob: string;
  mobile: string;
  gender?: string;
}

export interface AddressInsertPayload {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  county: string;
  postcode: string;
}

export interface CardCreatePayload {
  cardStatus: string;
}
