import { handle } from 'hono/aws-lambda';

import app from '../src';

export const handler = handle(app);
