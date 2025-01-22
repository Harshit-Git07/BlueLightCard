import { z } from 'zod';
import { CardStatus } from './enums/CardStatus';
import { PaymentStatus } from './enums/PaymentStatus';
import { PrintingErrorStatus } from '@blc-mono/shared/models/members/enums/PrintingErrorStatus';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

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
    ingestionLastTriggered: z.string().datetime().optional(),
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

export const AwaitingBatchingCardModel = createZodNamedType(
  'AwaitingBatchingCardModel',
  CardModel.omit({
    memberId: true,
    expiryDate: true,
    cardStatus: true,
    postedDate: true,
    printedDate: true,
    refundedDate: true,
    paymentStatus: true,
    batchNumber: true,
    promoCode: true,
  }),
);

export type AwaitingBatchingCardModel = z.infer<typeof AwaitingBatchingCardModel>;

export const BatchedCardModel = createZodNamedType(
  'BatchedCardModel',
  CardModel.omit({
    memberId: true,
    expiryDate: true,
    printingErrorStatus: true,
    purchaseDate: true,
    refundedDate: true,
    paymentStatus: true,
    batchNumber: true,
    promoCode: true,
  }),
);

export type BatchedCardModel = z.infer<typeof BatchedCardModel>;
