import { middleware } from '../../../middleware';
import { CardPrintBatchModel } from '@blc-mono/shared/models/members/cardPrintBatchModel';

const unwrappedHandler = async (): Promise<CardPrintBatchModel> => {
  // TODO: Actually implement this
  return {
    cardNumbers: ['ABC13456'],
  };
};

export const handler = middleware(unwrappedHandler);
