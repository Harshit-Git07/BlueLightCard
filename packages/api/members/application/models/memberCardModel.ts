import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { CardStatus } from '../enums/CardStatus';
import { PaymentStatus } from '../enums/PaymentStatus';

export const MemberCardModel = createZodNamedType(
  'MemberCardModel',
  z
    .object({
      pk: z.string().startsWith('MEMBER#'),
      sk: z.string().startsWith('CARD#'),
      name_on_card: z.string(),
      card_status: z.nativeEnum(CardStatus).nullable(),
      expiry_date: z.string().datetime().nullable(),
      posted_date: z.string().datetime().nullable(),
      purchase_time: z.string().datetime().nullable(),
      payment_status: z.nativeEnum(PaymentStatus).nullable(),
      batch_number: z.string().nullable(),
    })
    .transform((card) => ({
      uuid: card.pk.replace('MEMBER#', ''),
      cardNumber: card.sk.replace('CARD#', ''),
      name_on_card: card.name_on_card,
      card_status: card.card_status,
      expiry_date: transformDateToFormatYYYYMMDD(card.expiry_date),
      posted_date: transformDateToFormatYYYYMMDD(card.posted_date),
      purchase_time: transformDateToFormatYYYYMMDD(card.purchase_time), // TODO: This should be a timestamp?
      payment_status: card.payment_status,
      batch_number: card.batch_number,
    })),
);

export type MemberCardModel = z.infer<typeof MemberCardModel>;
