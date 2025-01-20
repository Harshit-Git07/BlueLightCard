import { middleware } from '../../../middleware';

const unwrappedHandler = async (): Promise<void> => {
  // TODO: Implement handler
};

export const handler = middleware(unwrappedHandler);
