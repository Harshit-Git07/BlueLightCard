import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { Gender } from '../enums/Gender';

// Database schema
export const MemberProfileCustomerModel = createZodNamedType(
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
        )
        .optional(),
      gender: z.nativeEnum(Gender).nullable().optional(),
      phoneNumber: z.string().nullable().optional(),
      county: z.string().optional(),
      employmentType: z.string().optional(),
      organisationId: z.string().uuid().optional(),
      employerId: z.string().uuid().optional(),
      jobTitle: z.string().optional(),
      jobReference: z.string().optional(),
    })
    .transform((profile) => ({
      memberId: profile.pk.replace('MEMBER#', ''),
      profileId: profile.sk.replace('PROFILE#', ''),
      dateOfBirth: transformDateToFormatYYYYMMDD(profile.dateOfBirth ?? null),
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      employmentType: profile.employmentType,
      organisationId: profile.organisationId,
      employerId: profile.employerId,
      jobTitle: profile.jobTitle,
      jobReference: profile.jobReference,
    })),
);

export type MemberProfileCustomerModel = z.infer<typeof MemberProfileCustomerModel>;
