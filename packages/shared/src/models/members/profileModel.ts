import { z } from 'zod';
import { Gender } from './enums/Gender';
import { CardModel } from './cardModel';
import { ApplicationModel } from './applicationModel';
import { EmploymentStatus } from './enums/EmploymentStatus';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

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
    employmentStatus: z.nativeEnum(EmploymentStatus).optional(),
    gender: z.nativeEnum(Gender).optional(),
    phoneNumber: z.string().optional(),
    county: z.string().optional(),
    email: z.string().email(),
    emailValidated: z.boolean().default(false).optional(),
    spareEmail: z.string().email().optional(),
    spareEmailValidated: z.boolean().default(false).optional(),
    organisationId: z.string().uuid().optional(),
    employerId: z.string().uuid().optional(),
    employerName: z.string().optional(),
    companyNumber: z.string().optional(),
    jobTitle: z.string().optional(),
    jobReference: z.string().optional(),
    signupDate: z.string().datetime().optional(),
    gaKey: z.string().optional(),
    status: z.string().optional(),
    lastLogin: z.string().optional(),
    lastIpAddress: z.string().optional(),
    documents: z.array(z.string()).default([]).optional(),
    cards: z.array(CardModel).default([]).optional(),
    applications: z.array(ApplicationModel).default([]).optional(),
    ingestionLastTriggered: z.string().datetime().optional(),
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
    employmentStatus: true,
  }),
);
export type CreateProfileModel = z.infer<typeof CreateProfileModel>;

export const AdminCreateProfileModel = createZodNamedType(
  'AdminCreateProfileModel',
  CreateProfileModel.extend({
    password: z.string(),
  }),
);
export type AdminCreateProfileModel = z.infer<typeof AdminCreateProfileModel>;

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
    documents: true,
    cards: true,
    applications: true,
  }),
);
export type UpdateProfileModel = z.infer<typeof UpdateProfileModel>;
