import { Gender } from '../enums/Gender';

export interface MemberProfileCustomerQueryPayload {
  memberUUID: string;
  profileId: string;
}

export interface MemberProfileCustomerUpdatePayload {
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  county: string;
  employmentType: string;
  organisationId: string;
  employerId: string;
  jobTitle: string;
  jobReference: string;
}
