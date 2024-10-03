import { env } from 'hono/adapter';
import { createFactory } from 'hono/factory';
import { logger } from 'hono/logger';

import { createDbConnection } from './db';
import { type Env, zEnv } from './env';

export type Factory = {
  Bindings: Env;
  Variables: {
    env: Env;
    db: ReturnType<typeof createDbConnection>;
  };
};

const db = createDbConnection();

export default createFactory<Factory>({
  initApp: (app) => {
    app.use(logger());
    app.use(async (c, next) => {
      const e = zEnv.parse(env(c));
      c.set('env', e);

      c.set('db', db);
      await next();
    });
  },
});
