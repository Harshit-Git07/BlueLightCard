import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { NewCardReason } from '../enums/NewCardReason';

export const MemberApplicationModel = createZodNamedType(
  'MemberApplicationModel',
  z
    .object({
      pk: z.string().startsWith('MEMBER#'),
      sk: z.string().startsWith('APPLICATION#'),
      addr1: z.string(),
      addr2: z.string(),
      city: z.string(),
      postcode: z.string(),
      country: z.string(),
      start_time: z.string().datetime(),
      eligibility_status: z.string(),
      verification_method: z.string(),
      id_s3_primary: z.string(),
      id_s3_secondary: z.string(),
      trusted_domain_email: z.string(),
      new_card_reason: z.nativeEnum(NewCardReason).nullable(),
      change_reason: z.string().nullable(),
      change_firstname: z.string().nullable(),
      change_surname: z.string().nullable(),
      change_doc_type: z.string().nullable(),
      rejection_reason: z.string().nullable(),
    })
    .transform((application) => ({
      member_uuid: application.pk.replace('MEMBER#', ''),
      application_uuid: application.sk.replace('APPLICATION#', ''),
      addr1: application.addr1,
      addr2: application.addr2,
      city: application.city,
      postcode: application.postcode,
      country: application.country,
      start_time: transformDateToFormatYYYYMMDD(application.start_time),
      eligibility_status: application.eligibility_status,
      verification_method: application.verification_method,
      id_s3_primary: application.id_s3_primary,
      id_s3_secondary: application.id_s3_secondary,
      trusted_domain_email: application.trusted_domain_email,
      new_card_reason: application.new_card_reason,
      change_reason: application.change_reason,
      change_firstname: application.change_firstname,
      change_surname: application.change_surname,
      change_doc_type: application.change_doc_type,
      rejection_reason: application.rejection_reason,
    })),
);

export type MemberApplicationModel = z.infer<typeof MemberApplicationModel>;
