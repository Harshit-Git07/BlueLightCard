import { Hono } from 'hono';

import company from './routes/company';

export const app = new Hono().route('/companies', company);

export default app;

export type OffersApp = typeof app;
