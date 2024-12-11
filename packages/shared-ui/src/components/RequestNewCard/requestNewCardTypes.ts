export interface RequestNewCardAtom {
  preferredStep: number;
  currentStep: number;
  sequence: REQUEST_NEW_CARD_STEP[];
  verificationMethod: string;
}

export interface Address {
  address1?: string;
  address2?: string;
  county?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export enum REQUEST_NEW_CARD_STEP {
  REASON = 'REASON',
  ADDRESS = 'ADDRESS',
  ID_VERIFICATION_METHOD = 'ID_VERIFICATION_METHOD',
  ID_VERIFICATION_EMAIL = 'ID_VERIFICATION_EMAIL',
  ID_VERIFICATION_UPLOAD = 'ID_VERIFICATION_UPLOAD',
  PAYMENT = 'PAYMENT',
  DONE = 'DONE',
}
