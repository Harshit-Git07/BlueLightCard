import { HTTPException } from 'hono/http-exception';

import { getOffer } from '../data/offer';
import factory from '../lib/factory';

const offers = factory.createApp().get('/:offerId', async (c) => {
  const { offerId } = c.req.param();

  const item = await getOffer(offerId);

  if (!item) {
    throw new HTTPException(404, { message: 'Offer not found' });
  }

  return c.json(item);
});

export default offers;
