import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

// cardPaymentStatus and cardCreated are not returned by the identity table
// so is always an empty string
// expires is in epoch time in identity table e.g. 1785542399000
export const CustomerCardModel = createZodNamedType(
  'CustomerCardModel',
  z
    .object({
      sk: z.string().startsWith('CARD#'),
      cardCreated: z.string().nullable().default(''),
      expires: z.string().nullable(),
      status: z.string().nullable(),
      cardPaymentStatus: z.string().nullable().default(''),
    })
    .transform((card) => ({
      cardNumber: card.sk.replace('CARD#', ''),
      cardCreated:
        card.cardCreated && card.cardCreated != '' ? new Date(Number(card.cardCreated)) : null,
      cardExpiry: card.expires ? new Date(Number(card.expires)) : null,
      cardStatus: card.status,
      cardPaymentStatus: card.cardPaymentStatus,
    })),
);

export type CustomerCardModel = z.infer<typeof CustomerCardModel>;
