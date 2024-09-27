import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

// Database schema
export const MemberProfileDBSchema = z.object({
  pk: z.string().startsWith('MEMBER#'),
  sk: z.string().startsWith('PROFILE#'),
  firstname: z.string(),
  surname: z.string(),
  dob: z.string().nullable(),
  gender: z.string().nullable(),
  mobile: z.string().nullable(),
  email: z.string(),
  email_validated: z.number().default(0),
  spare_email: z.string().optional(),
  spare_email_validated: z.number().optional().default(0),
  organisation: z.string(),
  employer: z.string(),
  employer_id: z.string(),
  ga_key: z.string().optional(),
  merged_time: z.string().optional(),
  merged_uid: z.string().optional(),
  county: z.string(),
  employment_type: z.string(),
  jobtitle: z.string(),
  reference: z.string(),
  signup_date: z.string(),
  signup_source: z.string(),
  last_ip: z.string(),
  last_login: z.string(),
  blocked: z.boolean(),
  card_number: z.string(),
  card_expire: z.string(),
  card_status: z.string(),
  card_payment_status: z.string(),
});

// Application schema
export const MemberProfileModel = createZodNamedType(
  'MemberProfileModel',
  MemberProfileDBSchema.transform((profile) => ({
    uuid: profile.pk.replace('MEMBER#', ''),
    firstname: profile.firstname,
    surname: profile.surname,
    dob: transformDateToFormatYYYYMMDD(profile.dob),
    gender: profile.gender,
    mobile: profile.mobile,
    email: profile.email,
    emailValidated: profile.email_validated,
    spareEmail: profile.spare_email,
    spareEmailValidated: profile.spare_email_validated,
    organisation: profile.organisation,
    employer: profile.employer,
    employerId: profile.employer_id,
    gaKey: profile.ga_key,
    mergedTime: profile.merged_time,
    mergedUid: profile.merged_uid,
    county: profile.county,
    employmentType: profile.employment_type,
    jobTitle: profile.jobtitle,
    reference: profile.reference,
    signupDate: transformDateToFormatYYYYMMDD(profile.signup_date),
    signupSource: profile.signup_source,
    lastIp: profile.last_ip,
    lastLogin: profile.last_login,
    blocked: profile.blocked,
    cardNumber: profile.card_number,
    cardExpire: transformDateToFormatYYYYMMDD(profile.card_expire),
    cardStatus: profile.card_status,
    cardPaymentStatus: profile.card_payment_status,
  })),
);

export type MemberProfileDB = z.infer<typeof MemberProfileDBSchema>;
export type MemberProfileApp = z.infer<typeof MemberProfileModel>;

export const transformDBToApp = (dbProfile: MemberProfileDB): MemberProfileApp =>
  MemberProfileModel.parse(dbProfile);
