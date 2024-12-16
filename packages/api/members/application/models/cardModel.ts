import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { CardStatus } from './enums/CardStatus';
import { PaymentStatus } from './enums/PaymentStatus';
import { PrintingErrorStatus } from '@blc-mono/members/application/models/enums/PrintingErrorStatus';

export const CardModel = createZodNamedType(
  'CardModel',
  z.object({
    memberId: z.string().uuid(),
    cardNumber: z.string(),
    nameOnCard: z.string(),
    cardStatus: z.nativeEnum(CardStatus),
    createdDate: z.string().datetime(),
    expiryDate: z.string().datetime(),
    postedDate: z.string().datetime().nullable().optional(),
    printedDate: z.string().datetime().nullable().optional(),
    purchaseDate: z.string().datetime().optional(),
    refundedDate: z.string().datetime().optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    batchNumber: z.string().optional(),
    printingErrorStatus: z.nativeEnum(PrintingErrorStatus).optional(),
    promoCode: z.string().optional(),
    updated: z.string().datetime().nullable().optional(),
  }),
);

export type CardModel = z.infer<typeof CardModel>;

export const UpdateCardModel = createZodNamedType(
  'UpdateCardModel',
  CardModel.omit({
    memberId: true,
    cardNumber: true,
    createdDate: true,
    expiryDate: true,
    purchaseDate: true,
    nameOnCard: true,
  }),
);

export type UpdateCardModel = z.infer<typeof UpdateCardModel>;
