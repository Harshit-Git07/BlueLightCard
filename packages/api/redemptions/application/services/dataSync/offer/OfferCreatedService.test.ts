import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { offerCreatedEventFactory } from '../../../../libs/test/factories/offerEvents.factory';
import { RedemptionsTestDatabase } from '../../../../libs/test/helpers/database';
import { OfferCreatedEvent } from '../../../controllers/eventBridge/offer/OfferCreatedController';
import { GenericsRepository } from '../../../repositories/GenericsRepository';
import { RedemptionsRepository } from '../../../repositories/RedemptionsRepository';

import { OfferCreatedService } from './OfferCreatedService';

describe('OfferCreatedService', () => {
  function makeOfferCreatedService(connection: IDatabaseConnection) {
    const redemptionsRepository = new RedemptionsRepository(connection);
    const genericsRepository = new GenericsRepository(connection);
    const transactionManager = new TransactionManager(connection);
    return new OfferCreatedService(redemptionsRepository, genericsRepository, transactionManager);
  }

  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database.reset();
  });

  afterAll(async () => {
    await database?.down?.();
  });

  describe('createOffer', () => {
    function callCreateOffer(event: OfferCreatedEvent) {
      const service = makeOfferCreatedService(connection);
      return service.createOffer(event);
    }

    describe('should map event data correctly', () => {
      it('should insert mapped event data into DB tables', async () => {
        const event = offerCreatedEventFactory.build({
          detail: {
            offerId: 111,
            companyId: 111,
            offerUrl: 'https://example.com/offer',
            offerCode: 'OFFER123',
            offerType: 1,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(redemptionData.length).toBe(1);
        expect(genericsData.length).toBe(1);
        expect(genericsData[0].redemptionId).toBe(redemptionData[0].id);
      });

      it('should set no connection, in-store, showCard', async () => {
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: '',
            offerCode: '',
            offerType: 5,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].connection).toBe('none');
        expect(redemptionData[0].offerType).toBe('in-store');
        expect(redemptionData[0].redemptionType).toBe('showCard');
        expect(redemptionData[0].url).toBe(null);
      });

      it('should set no connection, online, vault', async () => {
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: 'https://thevault.bluelightcard.co.uk',
            offerCode: '',
            offerType: 1,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].connection).toBe('none');
        expect(redemptionData[0].offerType).toBe('online');
        expect(redemptionData[0].redemptionType).toBe('vault');
        expect(redemptionData[0].url).toBe('https://thevault.bluelightcard.co.uk');
      });

      it('should set no connection, in-store, vault', async () => {
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: 'https://thevault.bluelightcard.co.uk',
            offerCode: '',
            offerType: 5,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].connection).toBe('none');
        expect(redemptionData[0].offerType).toBe('in-store');
        expect(redemptionData[0].redemptionType).toBe('vault');
        expect(redemptionData[0].url).toBe('https://thevault.bluelightcard.co.uk');
      });

      it('should set spotify connection, online, vault', async () => {
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: 'https://www.spotify.com/uk/ppt/bluelightcard/?code=!!!CODE!!!',
            offerCode: '',
            offerType: 1,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].connection).toBe('spotify');
        expect(redemptionData[0].offerType).toBe('online');
        expect(redemptionData[0].redemptionType).toBe('vault');
        expect(redemptionData[0].url).toBe('https://www.spotify.com/uk/ppt/bluelightcard/?code=!!!CODE!!!');
      });

      it('should set direct connection, online, generic, and insert generics record', async () => {
        // Mock event data
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: 'https://www.generic.com',
            offerCode: 'OFFER123',
            offerType: 1,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].connection).toBe('direct');
        expect(redemptionData[0].offerType).toBe('online');
        expect(redemptionData[0].redemptionType).toBe('generic');
        expect(redemptionData[0].url).toBe('https://www.generic.com');
        expect(genericsData[0].redemptionId).toBe(redemptionData[0].id);
        expect(genericsData[0].code).toBe('OFFER123');
      });

      it('should set no connection, in-store, generic, and insert generics record', async () => {
        // Mock event data
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: '',
            offerCode: 'OFFER123',
            offerType: 5,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].connection).toBe('none');
        expect(redemptionData[0].offerType).toBe('in-store');
        expect(redemptionData[0].redemptionType).toBe('generic');
        expect(redemptionData[0].url).toBe(null);
        expect(genericsData[0].redemptionId).toBe(redemptionData[0].id);
        expect(genericsData[0].code).toBe('OFFER123');
      });

      it('should set direct connection, online, preApplied', async () => {
        // Mock event data
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: 'https://www.preApplied.com',
            offerCode: '',
            offerType: 1,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].connection).toBe('direct');
        expect(redemptionData[0].offerType).toBe('online');
        expect(redemptionData[0].redemptionType).toBe('preApplied');
        expect(redemptionData[0].url).toBe('https://www.preApplied.com');
      });

      it('should set affiliate connection, online, preApplied', async () => {
        // Mock event data
        const event = offerCreatedEventFactory.build({
          detail: {
            offerUrl: 'https://www.awin1.com',
            offerCode: '',
            offerType: 1,
          },
        });
        await callCreateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptionData[0].affiliate).toBe('awin');
        expect(redemptionData[0].connection).toBe('affiliate');
        expect(redemptionData[0].offerType).toBe('online');
        expect(redemptionData[0].redemptionType).toBe('preApplied');
        expect(redemptionData[0].url).toBe('https://www.awin1.com');
      });
    });
  });
});
