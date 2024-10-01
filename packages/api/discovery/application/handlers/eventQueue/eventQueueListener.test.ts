import { SQSRecord } from 'aws-lambda';

import { handleCompanyUpdated } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyEventHandler';
import {
  handleOfferDeleted,
  handleOfferUpdated,
} from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/OfferEventHandler';
import { mapSanityCompanyToCompany } from '@blc-mono/discovery/helpers/mapSanityCompanyToCompany';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/mapSanityOfferToOffer';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { handler } from './eventQueueListener';

jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/OfferEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyEventHandler');
jest.mock('@blc-mono/discovery/helpers/mapSanityOfferToOffer');
jest.mock('@blc-mono/discovery/helpers/mapSanityCompanyToCompany');

const handleOfferUpdatedMock = jest.mocked(handleOfferUpdated);
const handleOfferDeletedMock = jest.mocked(handleOfferDeleted);
const handleCompanyUpdatedMock = jest.mocked(handleCompanyUpdated);

const mapSanityOfferToOfferMock = jest.mocked(mapSanityOfferToOffer);
const mapSanityCompanyToCompanyMock = jest.mocked(mapSanityCompanyToCompany);

describe('eventQueueListener', () => {
  it.each([Events.OFFER_CREATED, Events.OFFER_UPDATED])('should handle %s event', async (event) => {
    const offerRecord = buildSQSRecord(event);

    await handler({ Records: [offerRecord] });

    expect(mapSanityOfferToOfferMock).toHaveBeenCalledWith('body');
    expect(handleOfferUpdatedMock).toHaveBeenCalled();
  });

  it('should handle "offer.deleted" event', async () => {
    const offerDeletedRecord = buildSQSRecord(Events.OFFER_DELETED);

    await handler({ Records: [offerDeletedRecord] });

    expect(mapSanityOfferToOfferMock).toHaveBeenCalledWith('body');
    expect(handleOfferDeletedMock).toHaveBeenCalled();
  });

  it.each([Events.COMPANY_CREATED, Events.COMPANY_UPDATED])('should handle %s event', async () => {
    const companyRecord = buildSQSRecord(Events.COMPANY_UPDATED);

    await handler({ Records: [companyRecord] });

    expect(mapSanityCompanyToCompanyMock).toHaveBeenCalledWith('body');
    expect(handleCompanyUpdatedMock).toHaveBeenCalled();
  });

  it('should throw error on invalid event source', async () => {
    const invalidEventSourceRecord = buildSQSRecord('random-event-source');

    await expect(handler({ Records: [invalidEventSourceRecord] })).rejects.toThrow(
      'Error processing events: [Error: Invalid event source: [random-event-source]]',
    );
  });

  function buildSQSRecord(source: string): SQSRecord {
    return {
      body: JSON.stringify({
        source,
        detail: 'body',
      }),
    } as unknown as SQSRecord;
  }
});
