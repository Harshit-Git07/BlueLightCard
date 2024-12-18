import { type RichtextModule } from '@bluelightcard/sanity-types';
import { createRoute, z } from '@hono/zod-openapi';
import invariant from 'tiny-invariant';

import { getEvent } from '../../cms/data/event';
import { notFound } from '../errors/helpers';
import { openApiErrorResponses } from '../errors/openapi_responses';
import type { App } from '../hono/app';
import { EventSchema } from '../schema';

const route = createRoute({
  tags: ['offers'],
  operationId: 'getEvent',
  method: 'get',
  path: '/v2/events/{id}',
  request: {
    params: z.object({
      id: z.string().min(1).openapi({
        description: 'The id of the event to fetch',
        example: '123456',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Event',
      content: {
        'application/json': {
          schema: EventSchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
});

export type Route = typeof route;
export type V2ApisGetEventResponse = z.infer<
  (typeof route.responses)[200]['content']['application/json']['schema']
>;

export const registerV2OEventsGetEvent = (app: App) =>
  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');
    const item = await getEvent(id);

    if (!item) {
      notFound();
    }

    invariant(item.name, 'Missing `event.name`');
    invariant(item.eventDescription, 'Missing `event.eventDescription`');

    return c.json({
      type: 'ticket' as const,
      id: item._id,
      name: item.name,
      description: {
        _type: 'richtext-module' as RichtextModule['_type'],
        content: item.eventDescription,
      },
      expires: item.guestlistComplete ?? null,
      termsAndConditions: {
        _type: 'richtext-module' as RichtextModule['_type'],
        content: item.termsAndConditions,
      },
      image: item.image?.default?.asset?.url ?? null,
      startDate: item.eventDate ?? null,
      endDate: item.eventEndDate ?? null,
      venueName: item.venue?.name ?? null,
      howItWorks: {
        _type: 'richtext-module' as RichtextModule['_type'],
        content: item.howThisWorks?.howThisWorks,
      },
    });
  });
