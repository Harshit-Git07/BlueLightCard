import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';

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

export type MemberProfile = ProfileModel;
export type EmploymentStatus = MemberProfile['employmentStatus'];
export type Organisation = OrganisationModel;
export type Employer = EmployerModel;

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
