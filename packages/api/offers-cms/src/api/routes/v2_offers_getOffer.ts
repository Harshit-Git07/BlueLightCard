import { createRoute, z } from '@hono/zod-openapi';
import invariant from 'tiny-invariant';

import { getOffer } from '../../cms/data/offer';
import { notFound } from '../errors/helpers';
import { openApiErrorResponses } from '../errors/openapi_responses';
import type { App } from '../hono/app';
import { OfferSchema } from '../schema';

const route = createRoute({
  tags: ['offers'],
  operationId: 'getOffer',
  method: 'get',
  path: '/v2/offers/{id}',
  request: {
    params: z.object({
      id: z.string().min(1).openapi({
        description: 'The id of the offer to fetch',
        example: '123456',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Offer',
      content: {
        'application/json': {
          schema: OfferSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
});

export type Route = typeof route;
export type V2ApisGetOfferResponse = z.infer<
  (typeof route.responses)[200]['content']['application/json']['schema']
>;

export const registerV2OffersGetOffer = (app: App) =>
  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');
    const item = await getOffer(id);

    if (!item) {
      notFound();
    }

    invariant(item.name, 'Missing `offer.name`');
    invariant(item.offerDescription, 'Missing `offer.offerDescription`');
    invariant(item.offerType?.offerType, 'Missing `offer.offerType`');

    return c.json({
      id: item._id,
      name: item.name,
      description: item.offerDescription,
      type: item.offerType.offerType,
      expires: item.expires || null,
      termsAndConditions: item.termsAndConditions || null,
      image: item.image?.default?.asset?.url || null,
    });
  });
