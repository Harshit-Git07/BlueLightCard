import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

// Database schema
export const MemberProfileDBSchema = z.object({
  pk: z.string().startsWith('MEMBER#'),
  sk: z.string().startsWith('PROFILE#'),
  firstname: z.string(),
  lastName: z.string(),
  dateOfBirth: z
    .string()
    .nullable()
    .refine((value) => value === null || !isNaN(Date.parse(value)), {
      message: 'Invalid date format. Must be in ISO 8601 format.',
    }),
  gender: z.string().nullable(),
  mobile: z.string().nullable(),
  emailAddress: z.string(),
  emailValidated: z.number().default(0),
  spareEmail: z.string().optional(),
  spareEmailValidated: z.number().optional().default(0),
  organisation: z.string(),
  employer: z.string(),
  employerId: z.string(),
  gaKey: z.string().optional(),
  mergedTime: z.string().optional(),
  mergedUid: z.string().optional(),
  county: z.string(),
  employmentType: z.string(),
  jobTitle: z.string(),
  reference: z.string(),
  signupDate: z.string(),
  signupSource: z.string(),
  lastIp: z.string(),
  lastLogin: z.string(),
  blocked: z.boolean(),
  cardNumber: z.string(),
  cardExpire: z.string(),
  cardStatus: z.string(),
  cardPaymentStatus: z.string(),
});

// Application schema
export const MemberProfileModel = createZodNamedType(
  'MemberProfileModel',
  MemberProfileDBSchema.transform((profile) => ({
    uuid: profile.pk.replace('MEMBER#', ''),
    firstname: profile.firstname,
    lastName: profile.lastName,
    dateOfBirth: transformDateToFormatYYYYMMDD(profile.dateOfBirth),
    gender: profile.gender,
    mobile: profile.mobile,
    emailAddress: profile.emailAddress,
    emailValidated: profile.emailValidated,
    spareEmail: profile.spareEmail,
    spareEmailValidated: profile.spareEmailValidated,
    organisation: profile.organisation,
    employer: profile.employer,
    employerId: profile.employerId,
    gaKey: profile.gaKey,
    mergedTime: profile.mergedTime,
    mergedUid: profile.mergedUid,
    county: profile.county,
    employmentType: profile.employmentType,
    jobTitle: profile.jobTitle,
    reference: profile.reference,
    signupDate: transformDateToFormatYYYYMMDD(profile.signupDate),
    signupSource: profile.signupSource,
    lastIp: profile.lastIp,
    lastLogin: profile.lastLogin,
    blocked: profile.blocked,
    cardNumber: profile.cardNumber,
    cardExpire: transformDateToFormatYYYYMMDD(profile.cardExpire),
    cardStatus: profile.cardStatus,
    cardPaymentStatus: profile.cardPaymentStatus,
  })),
);

export type MemberProfileDB = z.infer<typeof MemberProfileDBSchema>;
export type MemberProfileApp = z.infer<typeof MemberProfileModel>;

export const transformDBToApp = (dbProfile: MemberProfileDB): MemberProfileApp =>
  MemberProfileModel.parse(dbProfile);
