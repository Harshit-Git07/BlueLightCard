import type { components } from '../generated/MembersApi';

export type ApiMessage = {
  code: string;
  detail: string;
  source?: string;
};

export type ApiResponseSuccess = {
  messages: Array<ApiMessage>;
  requestId: string;
};

export type ApiResponseError = {
  error: Array<ApiMessage>;
};

export type MemberProfile = components['schemas']['ProfileModel'];

export type EmploymentStatus = components['schemas']['ProfileModel']['employmentStatus'];

// this definition is temporary while card reason is being worked on by service layer
export enum ReorderCardReason {
  CARD_NOT_RECEIVED_YET = 'CARD_NOT_RECEIVED_YET',
  LOST_CARD = 'LOST_CARD',
  STOLEN_CARD = 'STOLEN_CARD',
  DAMAGED_CARD = 'DAMAGED_CARD',
}

export type Organisation = components['schemas']['OrganisationModel'];
export type Employer = components['schemas']['EmployerModel'];

export type SupportedDocument = {
  idKey: string;
  guidelines: string;
  /** @enum {string} */
  type: 'IMAGE_UPLOAD' | 'TRUSTED_DOMAIN';
  /** @default false */
  required: boolean;
  title?: string;
  description?: string;
};
