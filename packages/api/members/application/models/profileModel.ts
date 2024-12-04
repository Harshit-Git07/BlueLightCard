import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { Gender } from './enums/Gender';
import { CardModel } from './cardModel';
import { ApplicationModel } from './applicationModel';
import { EmploymentStatus } from './enums/EmploymentStatus';

export const ProfileModel = createZodNamedType(
  'ProfileModel',
  z.object({
    memberId: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z
      .string()
      .date()
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return parsedDate < new Date();
        },
        {
          message: 'Date of birth must be before today',
        },
      ),
    gender: z.nativeEnum(Gender).optional(),
    phoneNumber: z.string().optional(),
    county: z.string().optional(),
    email: z.string().email(),
    emailValidated: z.boolean().default(false).optional(),
    spareEmail: z.string().email().optional(),
    spareEmailValidated: z.boolean().default(false).optional(),
    employmentStatus: z.nativeEnum(EmploymentStatus).optional(),
    organisationId: z.string().uuid().optional(),
    employerId: z.string().uuid().optional(),
    employerName: z.string().optional(),
    jobTitle: z.string().optional(),
    jobReference: z.string().optional(),
    signupDate: z.string().datetime().optional(),
    gaKey: z.string().optional(),
    status: z.string().optional(),
    lastLogin: z.string().optional(),
    lastIpAddress: z.string().optional(),
    idUploaded: z.boolean().optional(),
    card: CardModel.optional(),
    applications: z.array(ApplicationModel).default([]).optional(),
  }),
);
export type ProfileModel = z.infer<typeof ProfileModel>;

export const CreateProfileModel = createZodNamedType(
  'CreateProfileModel',
  ProfileModel.pick({
    firstName: true,
    lastName: true,
    email: true,
    dateOfBirth: true,
  }),
);
export type CreateProfileModel = z.infer<typeof CreateProfileModel>;

export const CreateProfileModelResponse = createZodNamedType(
  'CreateProfileModelResponse',
  z.object({
    memberId: z.string().uuid(),
  }),
);
export type CreateProfileModelResponse = z.infer<typeof CreateProfileModelResponse>;

export const UpdateProfileModel = createZodNamedType(
  'UpdateProfileModel',
  ProfileModel.omit({
    memberId: true,
    email: true,
    gaKey: true,
    lastLogin: true,
    lastIpAddress: true,
    idUploaded: true,
    card: true,
    applications: true,
  }),
);
export type UpdateProfileModel = z.infer<typeof UpdateProfileModel>;
