import { HTTPException } from 'hono/http-exception';

import { getCompany } from '../data/company';
import { getOffersByCompanyId } from '../data/offer';
import factory from '../lib/factory';

const companies = factory
  .createApp()
  .get('/:companyId', async (c) => {
    const { companyId } = c.req.param();

    const item = await getCompany(companyId);

    if (!item) {
      throw new HTTPException(404, { message: 'Company not found' });
    }

    return c.json(item);
  })
  .get('/:companyId/offers', async (c) => {
    const { companyId } = c.req.param();
    const offers = await getOffersByCompanyId(companyId);

    if (!offers) {
      throw new HTTPException(404, { message: 'Company not found' });
    }

    return c.json(offers);
  });

export default companies;
