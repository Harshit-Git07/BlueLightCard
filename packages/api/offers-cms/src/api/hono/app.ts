import { OpenAPIHono } from '@hono/zod-openapi';
import type { Context as GenericContext } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';

import { handleError } from '../errors/http';

import type { HonoEnv } from './env';

export function newApp() {
  const app = new OpenAPIHono<HonoEnv>();

  app.use(prettyJSON());
  app.use(requestId());
  app.use(logger());
  app.onError(handleError);

  app.doc('/openapi.json', {
    openapi: '3.0.0',
    info: {
      title: 'Offers API',
      version: '1.0.0',
    },
  });

  return app;
}

export type App = ReturnType<typeof newApp>;
export type Context = GenericContext<HonoEnv>;
