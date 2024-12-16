import { components } from '../generated/MembersApi';

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
  errors: Array<ApiMessage>;
};

export type MemberProfile = components['schemas']['ProfileModel'];

export type EmploymentStatus = components['schemas']['ProfileModel']['employmentStatus'];

export type Organisation = components['schemas']['OrganisationModel'];

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
