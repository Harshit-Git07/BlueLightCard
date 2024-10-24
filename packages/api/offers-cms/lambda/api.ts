import { handle } from 'hono/aws-lambda';

import app from '../src/api';

export const handler = handle(app);
