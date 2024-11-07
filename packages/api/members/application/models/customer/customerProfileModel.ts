import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { CustomerCardModel } from './customerCardModel';
import { CustomerApplicationModel } from './customerApplicationModel';

export const CustomerProfileModel = createZodNamedType(
  'CustomerProfileModel',
  z
    .object({
      firstName: z.string().nullable().default(''),
      lastName: z.string().nullable().default(''),
      dateOfBirth: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      mobile: z.string().nullable().optional(),
      emailAddress: z.string().nullable().default(''),
      county: z.string().nullable().default(''),
      employmentType: z.string().nullable().default(''),
      organisationId: z.string().nullable().default(''),
      employerId: z.string().nullable().optional(),
      employerName: z.string().nullable().default(''),
      jobTitle: z.string().nullable().default(''),
      reference: z.string().nullable().default(''),
      card: CustomerCardModel.nullable().default(null),
      applications: z.array(CustomerApplicationModel).default([]),
    })
    .transform((profile) => ({
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      gender: profile.gender,
      phoneNumber: profile.mobile,
      emailAddress: profile.emailAddress,
      county: profile.county,
      employmentType: profile.employmentType,
      organisationId: profile.organisationId,
      employerId: profile.employerId,
      employerName: profile.employerName,
      jobTitle: profile.jobTitle,
      reference: profile.reference,
      card: profile.card,
      applications: profile.applications,
    })),
);

export type CustomerProfileModel = z.infer<typeof CustomerProfileModel>;
