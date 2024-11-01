import { createRoute, z } from '@hono/zod-openapi';
import invariant from 'tiny-invariant';

import { extractBrand, getCompany } from '../../cms/data/company';
import { notFound } from '../errors/helpers';
import { openApiErrorResponses } from '../errors/openapi_responses';
import type { App } from '../hono/app';
import { CompanySchema } from '../schema';

const route = createRoute({
  tags: ['offers'],
  operationId: 'getCompany',
  method: 'get',
  path: '/v2/companies/{id}',
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
      description: 'Company',
      content: {
        'application/json': {
          schema: CompanySchema,
        },
      },
    },
    ...openApiErrorResponses,
  },
});

export type Route = typeof route;
export type V2CompaniesGetCompanyResponse = z.infer<
  (typeof route.responses)[200]['content']['application/json']['schema']
>;

export const registerV2CompaniesGetCompany = (app: App) =>
  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');
    const item = await getCompany(id);

    if (!item) {
      notFound();
    }

    const brand = extractBrand(item);

    if (!brand) {
      notFound();
    }

    invariant(brand.companyName, 'Missing `brand.companyName`');
    invariant(brand.companyShortDescription, 'Missing `brand.companyShortDescription`');

    return c.json({
      id: item._id,
      name: brand.companyName,
      description: brand.companyShortDescription,
    });
  });
