import { Gender } from '../enums/Gender';

export interface MemberProfileQueryPayload {
  memberUUID: string;
  profileId?: string;
}

export interface MemberProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  phoneNumber?: string;
  county?: string;
  emailAddress?: string;
  emailValidated?: number;
  spareEmail?: string;
  spareEmailValidated?: number;
  employmentType?: string;
  organisationId?: string;
  employerId?: string;
  employerName?: string;
  jobTitle?: string;
  jobReference?: string;
  signupDate?: string;
  gaKey?: string;
  profileStatus?: string;
  lastLogin?: string;
  lastIpAddress?: string;
  idUploaded?: boolean;
}
