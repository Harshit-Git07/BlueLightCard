import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { Gender } from '../enums/Gender';

// Database schema
export const MemberProfileModel = createZodNamedType(
  'MemberProfileModel',
  z
    .object({
      pk: z
        .string()
        .refine((val) => val.startsWith('MEMBER#'), {
          message: 'pk must start with MEMBER#',
        })
        .refine(
          (val) => {
            const uuid = val.replace('MEMBER#', '');
            return z.string().uuid().safeParse(uuid).success;
          },
          {
            message: 'pk must be a valid UUID after MEMBER#',
          },
        ),
      sk: z
        .string()
        .refine((val) => val.startsWith('PROFILE#'), {
          message: 'sk must start with PROFILE#',
        })
        .refine(
          (val) => {
            const uuid = val.replace('PROFILE#', '');
            return z.string().uuid().safeParse(uuid).success;
          },
          {
            message: 'sk must be a valid UUID after PROFILE#',
          },
        ),
      firstName: z.string(),
      lastName: z.string(),
      dateOfBirth: z
        .string()
        .refine(
          (date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime()) && parsedDate.toISOString() === date;
          },
          {
            message: 'Date of birth must be a valid ISO 8601 date string',
          },
        )
        .refine(
          (date) => {
            const parsedDate = new Date(date);
            return parsedDate < new Date();
          },
          {
            message: 'Date of birth must be before today',
          },
        ),
      gender: z.nativeEnum(Gender).nullable(),
      phoneNumber: z.string().nullable(),
      county: z.string(),
      emailAddress: z.string().email(),
      emailValidated: z.number().default(0),
      spareEmail: z.string().email().optional(),
      spareEmailValidated: z.number().optional().default(0),
      employmentType: z.string(),
      organisationId: z.string().uuid(),
      employerId: z.string().uuid(),
      employerName: z.string(),
      jobTitle: z.string(),
      jobReference: z.string(),
      signupDate: z.string().datetime().nullable(),
      gaKey: z.string().optional(),
      profileStatus: z.string().optional(),
      lastLogin: z.string(),
      lastIpAddress: z.string(),
      idUploaded: z.boolean().optional(),
    })
    .transform((profile) => ({
      memberId: profile.pk.replace('MEMBER#', ''),
      profileId: profile.sk.replace('PROFILE#', ''),
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: transformDateToFormatYYYYMMDD(profile.dateOfBirth),
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      emailAddress: profile.emailAddress,
      emailValidated: profile.emailValidated,
      spareEmail: profile.spareEmail,
      spareEmailValidated: profile.spareEmailValidated,
      employmentType: profile.employmentType,
      organisationId: profile.organisationId,
      employerId: profile.employerId,
      employerName: profile.employerName,
      jobTitle: profile.jobTitle,
      jobReference: profile.jobReference,
      signupDate: transformDateToFormatYYYYMMDD(profile.signupDate),
      gaKey: profile.gaKey,
      profileStatus: profile.profileStatus,
      lastLogin: profile.lastLogin,
      lastIpAddress: profile.lastIpAddress,
      idUploaded: profile.idUploaded ?? false,
    })),
);

export const UpdateIdUploadedSchema = z.object({
  idUploaded: z.boolean(),
});

export type UpdateIdUploadedPayload = z.infer<typeof UpdateIdUploadedSchema>;
export type MemberProfileModel = z.infer<typeof MemberProfileModel>;
