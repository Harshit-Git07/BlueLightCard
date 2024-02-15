import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Factory } from 'fishery';
import { mocked } from 'jest-mock';

import { Response } from '@blc-mono/core/utils/restResponse/response';

import { redemptionsTable } from '../../database/schema';
import { getRedemptionConfig } from '../../helpers/redemptionConfig';
import { IAPIGatewayEvent } from '../../helpers/RestApiHandler';
import { RedemptionsTestDatabase } from '../../helpers/test/database';

import { handler } from './postRedeem';

jest.mock('../../helpers/redemptionConfig', () => ({
  ...jest.requireActual('../../helpers/redemptionConfig'),
  getRedemptionConfig: jest.fn(),
}));

describe('POST Redeem Handler', () => {
  let database: RedemptionsTestDatabase;
  let db: ReturnType<typeof drizzle>;

  const createRedemptionId = () => `rdm-${crypto.randomUUID()}`;

  const redemption = Factory.define<typeof redemptionsTable.$inferSelect>(() => ({
    id: createRedemptionId(),
    offerId: 8722,
    companyId: 1,
    connection: 'affiliate',
    affiliate: 'awin',
    offerType: 'online',
    platform: 'BLC_UK',
    redemptionType: 'generic',
    url: 'https://www.blcshine.com',
  }));

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    db = (await database.getConnection()).db;
    await db.insert(redemptionsTable).values(redemption.build()).execute();
  }, 60_000);

  afterEach(async () => {
    await database.reset();
  });

  afterAll(async () => {
    await database?.down?.();
  });

  it('handles valid offerId successfully', async () => {
    const mockOfferId = 8722;

    mocked(getRedemptionConfig).mockImplementation((offerId: number) => {
      return db.select().from(redemptionsTable).where(eq(redemptionsTable.offerId, offerId)).execute();
    });
    const redemptionConfig = await getRedemptionConfig(mockOfferId);

    const response = await handler({
      body: JSON.stringify({ offerId: mockOfferId }),
    } as IAPIGatewayEvent);

    expect(response).toEqual(Response.createResponse(200, { data: redemptionConfig[0], message: 'OK' }));
  });

  it('returns BadRequest for invalid offerId', async () => {
    const mockOfferId = 1;

    mocked(getRedemptionConfig).mockImplementation((offerId: number) => {
      return db.select().from(redemptionsTable).where(eq(redemptionsTable.offerId, offerId)).execute();
    });

    const response = await handler({
      body: JSON.stringify({ offerId: mockOfferId }),
    } as IAPIGatewayEvent);

    expect(response).toEqual(Response.BadRequest({ message: 'Invalid OfferId' }));
  });
});
