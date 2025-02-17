import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const unwrappedHandler = async (): Promise<void> => {
  // TODO: Implement handler
};

export const handler = middleware(unwrappedHandler);
