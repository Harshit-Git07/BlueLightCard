import { v4 } from 'uuid';

import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityCompany } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompany';
import { buildTestSanityCompanyLocation } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompanyLocation';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

describe.skip('Nearest Offers', () => {
  // To Be unskipped in following ticket
  const updatedAtTimeStamp = new Date().toISOString();
  const generatedCompanyUUID = `test-company-${v4().toString()}`;
  const company = buildTestSanityCompany({ _updatedAt: updatedAtTimeStamp, _id: generatedCompanyUUID });

  beforeAll(async () => {
    await sendTestEvents({
      source: Events.COMPANY_CREATED,
      events: [buildTestSanityCompany({ _updatedAt: updatedAtTimeStamp, _id: generatedCompanyUUID })],
    });
    await sendTestEvents({ source: Events.OFFER_CREATED, events: [buildTestSanityOffer({ company })] });
    await sendTestEvents({
      source: Events.COMPANY_LOCATION_BATCH_CREATED,
      events: [
        buildTestSanityCompanyLocation({
          _id: generatedCompanyUUID,
          totalBatches: 2,
          batchIndex: 1,
          _updatedAt: updatedAtTimeStamp,
          locations: [
            {
              _type: 'company.location',
              addressLine1: 'Charnwood Edge',
              addressLine2: 'Syston Rd',
              storeName: 'BLC HQ',
              telephone: '+44712345678',
              townCity: 'Leicester',
              region: 'Leicestershire',
              country: 'UK',
              location: {
                _type: 'geopoint',
                lat: 52.71044,
                lng: -1.09585,
              },
              postcode: 'LE7 4UZ',
            },
          ],
        }),
      ],
    });
    await sendTestEvents({
      source: Events.COMPANY_LOCATION_BATCH_CREATED,
      events: [
        buildTestSanityCompanyLocation({
          _id: generatedCompanyUUID,
          totalBatches: 2,
          batchIndex: 2,
          _updatedAt: updatedAtTimeStamp,
        }),
      ],
    });
  });
  it('should populate', () => {
    expect(true).toBeTruthy();
  });
});
