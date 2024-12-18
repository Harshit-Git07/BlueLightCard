import { newApp } from './hono/app';
import { registerV2CompaniesGetCompany } from './routes/v2_companies_getCompany';
import { registerV2CompaniesGetCompanyOffers } from './routes/v2_companies_getCompanyOffers';
import { registerV2OEventsGetEvent } from './routes/v2_events_getEvent';
import { registerV2OffersGetOffer } from './routes/v2_offers_getOffer';

export type { V2CompaniesGetCompanyResponse } from './routes/v2_companies_getCompany';
export type { V2CompaniesGetCompanyOffersResponse } from './routes/v2_companies_getCompanyOffers';
export type { V2ApisGetEventResponse } from './routes/v2_events_getEvent';
export type { V2ApisGetOfferResponse } from './routes/v2_offers_getOffer';

const app = newApp();

// company apis
registerV2CompaniesGetCompany(app);
registerV2CompaniesGetCompanyOffers(app);

// offer apis
registerV2OffersGetOffer(app);

// event apis
registerV2OEventsGetEvent(app);

export default app;

export type OffersApp = typeof app;
