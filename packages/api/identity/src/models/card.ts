import { CardStatus } from '../../../core/src/types/cardStatus.enum';
import { getCardAction, getCardStatusNumeric, getPCardStatus } from '../../../core/src/utils/getCardStatus';
import {z} from 'zod';

const keys = Object.keys(CardStatus) as [keyof typeof CardStatus]

export const CardModel = z.object({
    sk: z.string(),
    expires: z.string(),
    cardPrefix: z.string().optional(),
    status: z.enum(keys),
    posted: z.string(),
    cardaction: z.string().optional()
}).transform(card => ({
    cardId: card.sk.replace('CARD#', ''),
    expires: card.expires,
    cardPrefix: card.cardPrefix,
    cardStatus: card.status,
    datePosted: card.posted,
    cardAction: getCardAction(card.status, card.posted)
}));

(CardModel as any)._ModelName = 'CardModel'

export type CardModel = z.infer<typeof CardModel>;