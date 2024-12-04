import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { CardStatus } from './enums/CardStatus';
import { PaymentStatus } from './enums/PaymentStatus';

export const CardModel = createZodNamedType(
  'CardModel',
  z.object({
    memberId: z.string().uuid(),
    cardNumber: z.string(),
    nameOnCard: z.string().optional(),
    cardStatus: z.nativeEnum(CardStatus).optional(),
    expiryDate: z.string().datetime().optional(),
    postedDate: z.string().datetime().optional(),
    purchaseTime: z.string().datetime().optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    batchNumber: z.string().optional(),
  }),
);

export type CardModel = z.infer<typeof CardModel>;

export const UpdateCardModel = createZodNamedType(
  'UpdateCardModel',
  CardModel.omit({
    memberId: true,
    cardNumber: true,
    expiryDate: true,
    postedDate: true,
    purchaseTime: true,
  }),
);

export type UpdateCardModel = z.infer<typeof UpdateCardModel>;
