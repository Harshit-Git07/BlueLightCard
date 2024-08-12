import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable, vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { vaultCreatedEventFactory, vaultUpdatedEventFactory } from '../../../libs/test/factories/vaultEvents.factory';
import { RedemptionsTestDatabase } from '../../../libs/test/helpers/database';
import { createTestLogger } from '../../../libs/test/helpers/logger';
import { VaultCreatedEvent } from '../../controllers/eventBridge/vault/VaultCreatedController';
import { VaultUpdatedEvent } from '../../controllers/eventBridge/vault/VaultUpdatedController';
import { AffiliateConfigurationHelper } from '../../helpers/affiliate/AffiliateConfiguration';
import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedemptionsRepository';
import { IVaultCodesRepository } from '../../repositories/VaultCodesRepository';
import { IVaultsRepository, VaultsRepository } from '../../repositories/VaultsRepository';

import { VaultService } from './VaultService';

describe('VaultService', () => {
  const mockedLogger = createTestLogger();
  const defaultVaultId = `vlt-${faker.string.uuid()}`;
  const defaultRedemptionId = `rdm-${faker.string.uuid()}`;
  const defaultOfferId = faker.number.int({
    min: 1,
    max: 1_000_000,
  });
  const defaultCampaignId = faker.number.int({
    min: 1,
    max: 1_000_000,
  });

  type MakeVaultServiceOptions = {
    overrides: {
      redemptionsRepository?: Partial<IRedemptionsRepository>;
      vaultsRepository?: Partial<IVaultsRepository>;
      vaultCodesRepository?: Partial<IVaultCodesRepository>;
      transactionManager?: Partial<ITransactionManager>;
    };
  };
  function makeVaultService(connection: IDatabaseConnection, options?: MakeVaultServiceOptions) {
    const redemptionRepository = options?.overrides.redemptionsRepository ?? new RedemptionsRepository(connection);
    const vaultsRepository = options?.overrides.vaultsRepository ?? new VaultsRepository(connection);
    const transactionManager = options?.overrides.transactionManager ? null : new TransactionManager(connection);
    const service = new VaultService(
      mockedLogger,
      as(redemptionRepository),
      as(vaultsRepository),
      as(transactionManager),
    );
    return service;
  }

  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database.reset(connection);
  });

  afterAll(async () => {
    await database?.down?.();
  });

  describe('updateVault', () => {
    function callUpdateVault(event: VaultUpdatedEvent) {
      const service = makeVaultService(connection);
      return service.updateVault(event);
    }

    describe('should map event data correctly', () => {
      it('when link is equal to affiliateUrl, connection should be affiliate', async () => {
        const linkEqual = 'https://www.awin1.com';
        const affiliateConfig = new AffiliateConfigurationHelper(linkEqual).getConfig();
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            link: linkEqual,
            offerId: defaultOfferId,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'direct',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1234,
          offerId: defaultOfferId,
          url: linkEqual,
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
        });
        // Act
        await callUpdateVault(event);

        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions.at(0)?.connection).toBe('affiliate');
        expect(redemptions.at(0)?.affiliate).toBe(affiliateConfig?.affiliate);
      });
      it('when link is not equal to affiliateUrl, connection should be direct', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            link: faker.internet.url(),
            offerId: defaultOfferId,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
          url: faker.internet.url(),
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
        });

        // Act
        await callUpdateVault(event);

        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions.at(0)?.connection).toBe('direct');
        expect(redemptions.at(0)?.affiliate).toBeNull();
      });
      it('when vaultStatus is equal to true, status of vault should be active', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            vaultStatus: true,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
          url: faker.internet.url(),
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'in-active',
        });

        // Act
        await callUpdateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults.at(0)?.status).toBe('active');
      });
      it('when vaultStatus is not equal to true, status of vault should be in-active', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            vaultStatus: false,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
          url: faker.internet.url(),
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
        });

        // Act
        await callUpdateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults.at(0)?.status).toBe('in-active');
      });
      it('when eeCampaignId is sent, integration of vault should be eagleeye and integrationId equal to eeCampaignId', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            ucCampaignId: undefined,
            eeCampaignId: defaultCampaignId,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
          integrationId: defaultCampaignId,
        });

        // Act
        await callUpdateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults.at(0)?.integration).toBe('eagleeye');
        expect(vaults.at(0)?.integrationId).toBe(defaultCampaignId);
      });
      it('when ucCampaignId is sent, integration of vault should be uniqodo and integrationId equal to ucCampaignId', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            ucCampaignId: defaultCampaignId,
            eeCampaignId: undefined,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
          integrationId: defaultCampaignId,
        });

        // Act
        await callUpdateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults.at(0)?.integration).toBe('uniqodo');
        expect(vaults.at(0)?.integrationId).toBe(defaultCampaignId);
      });
      it('when eeCampaignId is null, integration of vault should be null and integrationId equal to null', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            eeCampaignId: null,
            ucCampaignId: undefined,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
          integration: 'eagleeye',
          integrationId: defaultCampaignId,
        });

        // Act
        await callUpdateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults.at(0)?.integration).toBe(null);
        expect(vaults.at(0)?.integrationId).toBe(null);
      });
      it('when ucCampaignId is null, integration of vault should be null and integrationId equal to null', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            eeCampaignId: undefined,
            ucCampaignId: null,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
          integration: 'eagleeye',
          integrationId: defaultCampaignId,
        });

        // Act
        await callUpdateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults.at(0)?.integration).toBe(null);
        expect(vaults.at(0)?.integrationId).toBe(null);
      });
      it('when linkId and link is sent, redemptionType of vault should be vault', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            linkId: 1234,
            link: 'https://www.example.com',
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'direct',
          offerType: 'online',
          redemptionType: 'vaultQR',
          companyId: 1233,
          offerId: defaultOfferId,
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
        });

        // Act
        await callUpdateVault(event);
        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions.at(0)?.redemptionType).toBe('vault');
      });
      it('when linkId and link is not sent, redemptionType of vault should be vaultQR', async () => {
        // Arrange
        const event = vaultUpdatedEventFactory.build({
          detail: {
            offerId: defaultOfferId,
            linkId: null,
            link: null,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          id: defaultRedemptionId,
          connection: 'affiliate',
          affiliate: 'awin',
          offerType: 'online',
          redemptionType: 'vault',
          companyId: 1233,
          offerId: defaultOfferId,
        });
        await connection.db.insert(vaultsTable).values({
          id: defaultVaultId,
          redemptionId: defaultRedemptionId,
          status: 'active',
        });

        // Act
        await callUpdateVault(event);
        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions.at(0)?.redemptionType).toBe('vaultQR');
      });
    });
  });

  describe('createVault', () => {
    function callCreateVault(event: VaultCreatedEvent) {
      const service = makeVaultService(connection);
      return service.createVault(event);
    }

    describe('should map event data correctly', () => {
      it('for Eagle Eye vaults', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            eeCampaignId: faker.number.int(500),
            ucCampaignId: undefined,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].integration).toBe('eagleeye');
        expect(vaults[0].integrationId).toBe(event.detail.eeCampaignId);
      });
      it('for Uniqodo vaults', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            eeCampaignId: undefined,
            ucCampaignId: faker.number.int(500),
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].integration).toBe('uniqodo');
        expect(vaults[0].integrationId).toBe(event.detail.ucCampaignId);
      });
      it('for active vaults', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            vaultStatus: true,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].status).toBe('active');
      });
      it('for in-active vaults', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            vaultStatus: false,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].status).toBe('in-active');
      });
      it('for admin email', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            adminEmail: faker.internet.email(),
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].email).toBe(event.detail.adminEmail);
      });
      it('for missing admin email', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            adminEmail: undefined,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].email).toBeNull();
      });
      it('for passthrough fields', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            alertBelow: faker.number.int(100),
            maxPerUser: faker.number.int(100),
            showQR: faker.datatype.boolean(),
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].alertBelow).toBe(event.detail.alertBelow);
        expect(vaults[0].maxPerUser).toBe(event.detail.maxPerUser);
        expect(vaults[0].showQR).toBe(event.detail.showQR);
      });
      it('for redemptionId', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build();
        const redemption = await connection.db
          .insert(redemptionsTable)
          .values({
            companyId: event.detail.companyId,
            connection: 'direct',
            offerId: event.detail.offerId,
            offerType: 'online',
            redemptionType: 'vault',
          })
          .returning({
            redemptionId: redemptionsTable.id,
          });
        const redemptionId = redemption[0].redemptionId;

        // Act
        await callCreateVault(event);

        // Assert
        const vaults = await connection.db.select().from(vaultsTable).execute();
        expect(vaults).toHaveLength(1);
        expect(vaults[0].redemptionId).toBe(redemptionId);
      });
      it.each([
        ['awin', 'https://www.awin1.com/a/b?c=d'],
        ['affiliateFuture', 'https://scripts.affiliatefuture.com/a/b?c=d'],
        ['rakuten', 'https://click.linksynergy.com/a/b?c=d'],
        ['affilinet', 'https://being.successfultogether.co.uk/a/b?c=d'],
        ['webgains', 'https://track.webgains.com/a/b?c=d'],
        ['partnerize', 'https://prf.hn/a/b?c=d'],
        ['partnerize', 'https://prf.hn/a/MEMID/b?c=d'],
        ['partnerize', 'https://prf.hn/a/destination:/b?c=d'],
        ['partnerize', 'https://prf.hn/a/camref:/b?c=d'],
        ['impactRadius', 'https://www.example.com/c/?c=d'],
        ['adtraction', 'https://track.adtraction.com/a/b?c=d'],
        ['affiliateGateway', 'https://www.tagserve.com/a/b?c=d'],
        ['optimiseMedia', 'https://clk.omgt1.com/a/b?c=d'],
        ['commissionJunction', 'https://www.anrdoezrs.net/a/b?c=d'],
        ['commissionJunction', 'https://www.apmebf.com/a/b?c=d'],
        ['commissionJunction', 'https://www.awltovhc.com/a/b?c=d'],
        ['commissionJunction', 'https://www.dpbolvw.net/a/b?c=d'],
        ['commissionJunction', 'https://www.emjcd.com/a/b?c=d'],
        ['commissionJunction', 'https://www.ftjcfx.com/a/b?c=d'],
        ['commissionJunction', 'https://www.jdoqocy.com/a/b?c=d'],
        ['commissionJunction', 'https://www.kqzyfj.com/a/b?c=d'],
        ['commissionJunction', 'https://www.lduhtrp.net/a/b?c=d'],
        ['commissionJunction', 'https://www.mjbpab.com/a/b?c=d'],
        ['commissionJunction', 'https://www.qksrv.net/a/b?c=d'],
        ['commissionJunction', 'https://www.qksz.net/a/b?c=d'],
        ['commissionJunction', 'https://www.tkqlhce.com/a/b?c=d'],
        ['commissionJunction', 'https://www.tqlkg.com/a/b?c=d'],
        ['commissionJunction', 'https://anrdoezrs.net/a/b?c=d'],
        ['commissionJunction', 'https://apmebf.com/a/b?c=d'],
        ['commissionJunction', 'https://awltovhc.com/a/b?c=d'],
        ['commissionJunction', 'https://dpbolvw.net/a/b?c=d'],
        ['commissionJunction', 'https://emjcd.com/a/b?c=d'],
        ['commissionJunction', 'https://ftjcfx.com/a/b?c=d'],
        ['commissionJunction', 'https://jdoqocy.com/a/b?c=d'],
        ['commissionJunction', 'https://kqzyfj.com/a/b?c=d'],
        ['commissionJunction', 'https://lduhtrp.net/a/b?c=d'],
        ['commissionJunction', 'https://mjbpab.com/a/b?c=d'],
        ['commissionJunction', 'https://qksrv.net/a/b?c=d'],
        ['commissionJunction', 'https://qksz.net/a/b?c=d'],
        ['commissionJunction', 'https://tkqlhce.com/a/b?c=d'],
        ['commissionJunction', 'https://tqlkg.com/a/b?c=d'],
        ['tradedoubler', 'https://tradedoubler.com/a/b?c=d'],
      ])('for affiliate connections (%s)', async (affiliate, affiliateUrl) => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            link: affiliateUrl,
            linkId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
          // We expect these to be updated by the handler
          connection: 'direct',
          affiliate: null,
          url: null,
        });

        // Act
        await callCreateVault(event);

        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions[0].connection).toBe('affiliate');
        expect(redemptions[0].url).toBe(event.detail.link);
        expect(redemptions[0].affiliate).toBe(affiliate);
      });
      it('for direct connections', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            link: faker.internet.url(),
            linkId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
          // We expect these to be updated by the handler
          connection: 'affiliate',
          affiliate: 'awin',
          url: 'https://www.awin1.com/a/b?c=d',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions[0].connection).toBe('direct');
        expect(redemptions[0].url).toBe(event.detail.link);
        expect(redemptions[0].affiliate).toBeNull();
      });
      it('for direct connections', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            link: faker.internet.url(),
            linkId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          offerId: event.detail.offerId,
          offerType: 'online',
          redemptionType: 'vault',
          // We expect these to be updated by the handler
          connection: 'affiliate',
          affiliate: 'awin',
          url: 'https://www.awin1.com/a/b?c=d',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions[0].connection).toBe('direct');
        expect(redemptions[0].url).toBe(event.detail.link);
        expect(redemptions[0].affiliate).toBeNull();
      });
      it('for vault redemption types', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            link: faker.internet.url(),
            linkId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          offerId: event.detail.offerId,
          offerType: 'online',
          connection: 'direct',
          // We expect these to be updated by the handler
          redemptionType: 'generic',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions[0].redemptionType).toBe('vault');
      });
      it('for vaultQR redemption types', async () => {
        // Arrange
        const event = vaultCreatedEventFactory.build({
          detail: {
            link: null,
            linkId: null,
          },
        });
        await connection.db.insert(redemptionsTable).values({
          companyId: event.detail.companyId,
          offerId: event.detail.offerId,
          offerType: 'online',
          connection: 'direct',
          // We expect these to be updated by the handler
          redemptionType: 'generic',
        });

        // Act
        await callCreateVault(event);

        // Assert
        const redemptions = await connection.db.select().from(redemptionsTable).execute();
        expect(redemptions).toHaveLength(1);
        expect(redemptions[0].redemptionType).toBe('vaultQR');
        expect(redemptions[0].connection).toBe('none');
      });
    });
  });
});
