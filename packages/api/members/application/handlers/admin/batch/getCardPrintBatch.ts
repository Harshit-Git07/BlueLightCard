import { middleware } from '../../../middleware';
import { CardPrintBatchModel } from '@blc-mono/members/application/models/cardPrintBatchModel';

const unwrappedHandler = async (): Promise<CardPrintBatchModel> => {
  // TODO: Actually implement this
  return {
    cardNumbers: ['ABC13456'],
  };
};

export const handler = middleware(unwrappedHandler);
