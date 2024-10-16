import { Hono } from 'hono';

import company from './routes/company';
import offer from './routes/offer';

export const app = new Hono().route('/companies', company).route('/offers', offer);

export default app;

export type OffersApp = typeof app;
