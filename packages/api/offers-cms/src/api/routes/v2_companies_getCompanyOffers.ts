import { createRoute, z } from '@hono/zod-openapi';
import invariant from 'tiny-invariant';

import { getCompany } from '../../cms/data/company';
import { getOffersByCompanyId } from '../../cms/data/offer';
import { coerceNumber } from '../../lib/utils';
import { notFound } from '../errors/helpers';
import { openApiErrorResponses } from '../errors/openapi_responses';
import type { App } from '../hono/app';
import { OfferSchema } from '../schema';

const route = createRoute({
  tags: ['offers'],
  operationId: 'getCompanyOffers',
  method: 'get',
  path: '/v2/companies/{id}/offers',
  request: {
    params: z.object({
      id: z.string().min(1).openapi({
        description: 'The id of the company to fetch',
        example: '123456',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Offers',
      content: {
        'application/json': {
          schema: z.array(OfferSchema),
        },
      },
    },
    ...openApiErrorResponses,
  },
});

export type Route = typeof route;
export type V2CompaniesGetCompanyOffersResponse = z.infer<
  (typeof route.responses)[200]['content']['application/json']['schema']
>;

export const registerV2CompaniesGetCompanyOffers = (app: App) =>
  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');

    let _id = coerceNumber(id);

    if (typeof _id === 'number') {
      const c = await getCompany(_id);

      invariant(c, 'Could not map legacy id');

      _id = c._id;
    }

    const items = await getOffersByCompanyId(_id);

    if (!items) {
      notFound();
    }

    const offers = items.map((offer) => {
      invariant(offer.name, 'Missing `offer.name`');
      invariant(offer.offerDescription, 'Missing `offer.offerDescription`');
      invariant(offer.offerType?.offerType, 'Missing `offer.offerType`');

      return {
        id: offer._id,
        name: offer.name,
        description: offer.offerDescription,
        type: offer.offerType.offerType,
        expires: offer.expires ?? null,
        termsAndConditions: offer.termsAndConditions || null,
        image: offer.image?.default?.asset?.url ?? null,
        companyId: offer.company?._id ?? null,
      };
    });

    return c.json(offers);
  });
