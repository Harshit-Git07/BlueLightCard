export interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mobile: string;
  gender?: string;
}

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

export interface CardCreatePayload {
  cardStatus: string;
}
