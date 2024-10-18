import { faker } from '@faker-js/faker';

import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { offerUpdatedEventFactory } from '../../../../libs/test/factories/offerEvents.factory';
import { RedemptionsTestDatabase } from '../../../../libs/test/helpers/database';
import { createTestLogger } from '../../../../libs/test/helpers/logger';
import { OfferUpdatedEvent } from '../../../controllers/eventBridge/offer/OfferUpdatedController';
import { GenericsRepository, NewGenericEntity } from '../../../repositories/GenericsRepository';
import {
  NewRedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../../../repositories/RedemptionConfigRepository';

import { OfferUpdatedService } from './OfferUpdatedService';

describe('OfferUpdatedService', () => {
  const mockedLogger = createTestLogger();

  function makeOfferUpdatedService(connection: IDatabaseConnection) {
    const redemptionsRepository = new RedemptionConfigRepository(connection);
    const genericsRepository = new GenericsRepository(connection);
    const transactionManager = new TransactionManager(connection);
    return new OfferUpdatedService(mockedLogger, redemptionsRepository, genericsRepository, transactionManager);
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

  describe('updateOffer', () => {
    type Redemption = typeof redemptionsTable.$inferSelect;
    type Generic = typeof genericsTable.$inferSelect;
    function callUpdateOffer(event: OfferUpdatedEvent) {
      const service = makeOfferUpdatedService(connection);
      return service.updateOffer(event);
    }

    async function createRedemptionToModify(
      redemptionData: NewRedemptionConfigEntity,
    ): Promise<Pick<Redemption, 'id'>[]> {
      return await connection.db
        .insert(redemptionsTable)
        .values(redemptionData)
        .returning({ id: redemptionsTable.id })
        .execute();
    }

    async function createGenericToModify(genericData: NewGenericEntity): Promise<Pick<Generic, 'id'>[]> {
      return await connection.db
        .insert(genericsTable)
        .values(genericData)
        .returning({ id: genericsTable.id })
        .execute();
    }

    describe('should map event data correctly', () => {
      it('should create the redemptions and generics records if they do not exist', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://non-exist-record.co.uk',
            offerCode: 'test123456',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const redemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptionData.length).toBe(1);
        expect(redemptionData[0].affiliate).toBe(null);
        expect(redemptionData[0].companyId).toBe(companyId);
        expect(redemptionData[0].connection).toBe('direct');
        expect(redemptionData[0].offerId).toBe(offerId);
        expect(redemptionData[0].offerType).toBe('online');
        expect(redemptionData[0].redemptionType).toBe('generic');
        expect(redemptionData[0].url).toBe('https://non-exist-record.co.uk');

        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(genericsData.length).toBe(1);
        expect(genericsData[0].redemptionId).toBe(redemptionData[0].id);
        expect(genericsData[0].code).toBe('test123456');
      });

      it('should not update vault offer that is affiliate', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create record to be modified
        const currentData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'vault',
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          url: 'https://www.awin1.com/',
        };
        await createRedemptionToModify(currentData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://thevault.bluelightcard.co.uk',
            offerCode: '',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const updatedData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedData.length).toBe(1);
        expect(updatedData[0].companyId).toBe(companyId);
        expect(updatedData[0].connection).toBe('affiliate');
        expect(updatedData[0].affiliate).toBe('awin');
        expect(updatedData[0].offerId).toBe(offerId);
        expect(updatedData[0].offerType).toBe('online');
        expect(updatedData[0].redemptionType).toBe('vault');
        expect(updatedData[0].url).toBe('https://www.awin1.com/');
      });

      it('should not update vault offer that is direct', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create record to be modified
        const currentData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'vault',
          connection: 'direct',
          offerType: 'online',
          url: 'https://direct.co.uk',
        };
        await createRedemptionToModify(currentData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://thevault.bluelightcard.co.uk',
            offerCode: '',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const updatedData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedData.length).toBe(1);
        expect(updatedData[0].affiliate).toBe(null);
        expect(updatedData[0].companyId).toBe(companyId);
        expect(updatedData[0].connection).toBe('direct');
        expect(updatedData[0].offerId).toBe(offerId);
        expect(updatedData[0].offerType).toBe('online');
        expect(updatedData[0].redemptionType).toBe('vault');
        expect(updatedData[0].url).toBe('https://direct.co.uk');
      });

      it('should update generic offer to preApplied and delete generics record', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create records to be modified
        const currentRedemptionData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'generic',
          connection: 'direct',
          offerType: 'online',
          url: 'https://generic-offer.co.uk',
        };
        const currentRedemption = await createRedemptionToModify(currentRedemptionData);

        const currentGenericData: NewGenericEntity = {
          redemptionId: currentRedemption[0].id,
          code: 'test123',
        };
        await createGenericToModify(currentGenericData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://preApplied-offer.co.uk',
            offerCode: '',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const updatedRedemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedRedemptionData.length).toBe(1);
        expect(updatedRedemptionData[0].affiliate).toBe(null);
        expect(updatedRedemptionData[0].companyId).toBe(companyId);
        expect(updatedRedemptionData[0].connection).toBe('direct');
        expect(updatedRedemptionData[0].offerId).toBe(offerId);
        expect(updatedRedemptionData[0].offerType).toBe('online');
        expect(updatedRedemptionData[0].redemptionType).toBe('preApplied');
        expect(updatedRedemptionData[0].url).toBe('https://preApplied-offer.co.uk');

        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(genericsData.length).toBe(0);
      });

      it('should update online generic offer to in-store and update generics record', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create records to be modified
        const currentRedemptionData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'generic',
          connection: 'direct',
          offerType: 'online',
          url: 'https://generic-offer.co.uk',
        };
        const currentRedemption = await createRedemptionToModify(currentRedemptionData);

        const currentGenericData: NewGenericEntity = {
          redemptionId: currentRedemption[0].id,
          code: 'test123',
        };
        await createGenericToModify(currentGenericData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: '',
            offerCode: 'test123-updated',
            offerType: 5,
          },
        });
        await callUpdateOffer(event);
        const updatedRedemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedRedemptionData.length).toBe(1);
        expect(updatedRedemptionData[0].affiliate).toBe(null);
        expect(updatedRedemptionData[0].companyId).toBe(companyId);
        expect(updatedRedemptionData[0].connection).toBe('none');
        expect(updatedRedemptionData[0].offerId).toBe(offerId);
        expect(updatedRedemptionData[0].offerType).toBe('in-store');
        expect(updatedRedemptionData[0].redemptionType).toBe('generic');
        expect(updatedRedemptionData[0].url).toBe(null);

        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(genericsData.length).toBe(1);
        expect(genericsData[0].redemptionId).toBe(currentRedemption[0].id);
        expect(genericsData[0].code).toBe('test123-updated');
      });

      it('should update preApplied offer to generic offer and insert generics record', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create records to be modified
        const currentRedemptionData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'preApplied',
          connection: 'direct',
          offerType: 'online',
          url: 'https://preApplied-offer.co.uk',
        };
        const currentRedemption = await createRedemptionToModify(currentRedemptionData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://generic-offer.co.uk',
            offerCode: 'test123',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const updatedRedemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedRedemptionData.length).toBe(1);
        expect(updatedRedemptionData[0].affiliate).toBe(null);
        expect(updatedRedemptionData[0].companyId).toBe(companyId);
        expect(updatedRedemptionData[0].connection).toBe('direct');
        expect(updatedRedemptionData[0].offerId).toBe(offerId);
        expect(updatedRedemptionData[0].offerType).toBe('online');
        expect(updatedRedemptionData[0].redemptionType).toBe('generic');
        expect(updatedRedemptionData[0].url).toBe('https://generic-offer.co.uk');

        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(genericsData.length).toBe(1);
        expect(genericsData[0].redemptionId).toBe(currentRedemption[0].id);
        expect(genericsData[0].code).toBe('test123');
      });

      it('should update generic offer connection from direct to affiliate and update generics record', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create records to be modified
        const currentRedemptionData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'generic',
          connection: 'direct',
          offerType: 'online',
          url: 'https://generic-offer.co.uk',
        };
        const currentRedemption = await createRedemptionToModify(currentRedemptionData);

        const currentGenericData: NewGenericEntity = {
          redemptionId: currentRedemption[0].id,
          code: 'test123',
        };
        await createGenericToModify(currentGenericData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://www.awin1.com',
            offerCode: 'test123-updated',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const updatedRedemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedRedemptionData.length).toBe(1);
        expect(updatedRedemptionData[0].affiliate).toBe('awin');
        expect(updatedRedemptionData[0].companyId).toBe(companyId);
        expect(updatedRedemptionData[0].connection).toBe('affiliate');
        expect(updatedRedemptionData[0].offerId).toBe(offerId);
        expect(updatedRedemptionData[0].offerType).toBe('online');
        expect(updatedRedemptionData[0].redemptionType).toBe('generic');
        expect(updatedRedemptionData[0].url).toBe('https://www.awin1.com');

        const genericsData = await connection.db.select().from(genericsTable).execute();
        expect(genericsData.length).toBe(1);
        expect(genericsData[0].redemptionId).toBe(currentRedemption[0].id);
        expect(genericsData[0].code).toBe('test123-updated');
      });

      it('should update preApplied offer to showCard offer', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create records to be modified
        const currentRedemptionData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'preApplied',
          connection: 'direct',
          offerType: 'online',
          url: 'https://preApplied-offer.co.uk',
        };
        await createRedemptionToModify(currentRedemptionData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: '',
            offerCode: '',
            offerType: 5,
          },
        });
        await callUpdateOffer(event);
        const updatedRedemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedRedemptionData.length).toBe(1);
        expect(updatedRedemptionData[0].affiliate).toBe(null);
        expect(updatedRedemptionData[0].companyId).toBe(companyId);
        expect(updatedRedemptionData[0].connection).toBe('none');
        expect(updatedRedemptionData[0].offerId).toBe(offerId);
        expect(updatedRedemptionData[0].offerType).toBe('in-store');
        expect(updatedRedemptionData[0].redemptionType).toBe('showCard');
        expect(updatedRedemptionData[0].url).toBe(null);
      });

      it('should update preApplied offer to vault spotify offer', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create records to be modified
        const currentRedemptionData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'preApplied',
          connection: 'direct',
          offerType: 'online',
          url: 'https://preApplied-offer.co.uk',
        };
        await createRedemptionToModify(currentRedemptionData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://www.spotify.com/uk/ppt/bluelightcard/?code=!!!CODE!!!',
            offerCode: '',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const updatedRedemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedRedemptionData.length).toBe(1);
        expect(updatedRedemptionData[0].affiliate).toBe(null);
        expect(updatedRedemptionData[0].companyId).toBe(companyId);
        expect(updatedRedemptionData[0].connection).toBe('spotify');
        expect(updatedRedemptionData[0].offerId).toBe(offerId);
        expect(updatedRedemptionData[0].offerType).toBe('online');
        expect(updatedRedemptionData[0].redemptionType).toBe('vault');
        expect(updatedRedemptionData[0].url).toBe('https://www.spotify.com/uk/ppt/bluelightcard/?code=!!!CODE!!!');
      });

      it('should update vault spotify offer to preApplied offer', async () => {
        const companyId = faker.string.uuid();
        const offerId = faker.string.uuid();

        //create records to be modified
        const currentRedemptionData: NewRedemptionConfigEntity = {
          offerId: offerId,
          companyId: companyId,
          redemptionType: 'vault',
          connection: 'spotify',
          offerType: 'online',
          url: 'https://www.spotify.com/uk/ppt/bluelightcard/?code=!!!CODE!!!',
        };
        await createRedemptionToModify(currentRedemptionData);

        //update created record and test is updated
        const event = offerUpdatedEventFactory.build({
          detail: {
            offerId: offerId,
            companyId: companyId,
            offerUrl: 'https://preApplied-offer.co.uk',
            offerCode: '',
            offerType: 1,
          },
        });
        await callUpdateOffer(event);
        const updatedRedemptionData = await connection.db.select().from(redemptionsTable).execute();
        expect(updatedRedemptionData.length).toBe(1);
        expect(updatedRedemptionData[0].affiliate).toBe(null);
        expect(updatedRedemptionData[0].companyId).toBe(companyId);
        expect(updatedRedemptionData[0].connection).toBe('direct');
        expect(updatedRedemptionData[0].offerId).toBe(offerId);
        expect(updatedRedemptionData[0].offerType).toBe('online');
        expect(updatedRedemptionData[0].redemptionType).toBe('preApplied');
        expect(updatedRedemptionData[0].url).toBe('https://preApplied-offer.co.uk');
      });
    });
  });
});
