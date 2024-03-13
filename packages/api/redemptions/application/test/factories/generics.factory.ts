import { Factory } from 'fishery';

import { createGenericsId, createRedemptionsId, genericsTable } from '@blc-mono/redemptions/libs/database/schema';

export const genericsFactory = Factory.define<typeof genericsTable.$inferSelect>(() => ({
  id: createGenericsId(),
  redemptionId: createRedemptionsId(),
  code: 'CODE-123',
}));
