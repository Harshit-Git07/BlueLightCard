import { faker } from '@faker-js/faker';
import { describe, it } from '@jest/globals';
import { QueryWithTypings } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';

import { as } from '@blc-mono/core/utils/testing';

import { createTestLogger } from '../../../helpers/test/logger';
import { VaultCreatedEvent } from '../../events/vault/vaultEvents';
import { vaultCreatedEventFactory } from '../../events/vault/vaultEvents.factory';

import { vaultCreatedHandler } from './vaultCreatedHandler';

describe('vaultCreatedHandler', () => {
  const logger = createTestLogger();

  describe('should map event data correctly', () => {
    function test(
      name: string,
      event: VaultCreatedEvent,
      expected?: (event: VaultCreatedEvent, query: QueryWithTypings) => void,
    ) {
      it(name, async () => {
        // Arrange
        const mockDatabaseConnection = {
          db: {
            execute: jest.fn().mockReturnValueOnce([
              {
                id: 'mock-vault-id',
              },
            ]),
          },
        };

        // Act
        await vaultCreatedHandler(as(mockDatabaseConnection), logger, event);

        // Assert
        expect(mockDatabaseConnection.db.execute).toHaveBeenCalledTimes(1);
        const pgDialect = new PgDialect();
        const query = pgDialect.sqlToQuery(mockDatabaseConnection.db.execute.mock.calls[0][0]);
        expected?.(event, query);
        expect(query.sql).toMatchSnapshot();
      });
    }
    test(
      'for Eagle Eye vaults',
      vaultCreatedEventFactory.build({
        detail: {
          eeCampaignId: faker.number.int(500),
          ucCampaignId: undefined,
        },
      }),
      (event, query) => {
        expect(query.params).toContain('eagleeye');
        expect(query.params).toContain(event.detail.eeCampaignId);
      },
    );

    test(
      'for Uniqodo vaults',
      vaultCreatedEventFactory.build({
        detail: {
          eeCampaignId: undefined,
          ucCampaignId: faker.number.int(500),
        },
      }),
      (event, query) => {
        expect(query.params).toContain('uniqodo');
        expect(query.params).toContain(event.detail.ucCampaignId);
      },
    );

    test(
      'for active vaults',
      vaultCreatedEventFactory.build({
        detail: {
          vaultStatus: true,
        },
      }),
      (_, query) => {
        expect(query.params).toContain('active');
      },
    );

    test(
      'for inactive vaults',
      vaultCreatedEventFactory.build({
        detail: {
          vaultStatus: false,
        },
      }),
      (_, query) => {
        expect(query.params).toContain('in-active');
      },
    );

    test(
      'for admin email',
      vaultCreatedEventFactory.build({
        detail: {
          adminEmail: faker.internet.email(),
        },
      }),
      (event, query) => {
        expect(query.params).toContain(event.detail.adminEmail);
      },
    );

    test(
      'for missing admin email',
      vaultCreatedEventFactory.build({
        detail: {
          adminEmail: undefined,
        },
      }),
    );

    test('for passthrough fields', vaultCreatedEventFactory.build(), (event, query) => {
      expect(query.params).toContain(event.detail.alertBelow);
      expect(query.params).toContain(event.detail.maxPerUser);
      expect(query.params).toContain(event.detail.showQR);
      expect(query.params).toContain(event.detail.terms);
    });
  });

  describe('throws an error if the event is invalid', () => {
    function test(name: string, event: unknown) {
      it(name, async () => {
        // Arrange
        const mockDatabaseConnection = {
          db: {
            execute: jest.fn().mockReturnValue([
              {
                id: 'mock-vault-id',
              },
            ]),
          },
        };

        // Act & Assert
        expect(
          async () => await vaultCreatedHandler(as(mockDatabaseConnection), logger, event),
        ).rejects.toThrowErrorMatchingSnapshot();
        expect(mockDatabaseConnection.db.execute).not.toHaveBeenCalled();
      });
    }

    test('because the event is null', null);
    test('because the event is undefined', undefined);
    test('because the event is an empty object', {});
    test('because the event is missing detail', vaultCreatedEventFactory.build({ detail: undefined }));
    test('because the event is missing time', vaultCreatedEventFactory.build({ time: undefined }));
    test('because the event detail is an empty object', {
      ...vaultCreatedEventFactory.build(),
      detail: {},
    });
    test(
      'because the `adminEmail` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          adminEmail: 'not-an-email',
        },
      }),
    );
    test(
      'because the `alertBelow` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          alertBelow: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `brand` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          brand: 123 as unknown as string,
        },
      }),
    );
    test(
      'because the `companyId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          companyId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `companyName` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          companyName: false as unknown as string,
        },
      }),
    );
    test(
      'because the `eeCampaignId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          eeCampaignId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `link` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          link: 123 as unknown as string,
        },
      }),
    );
    test(
      'because the `linkId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          linkId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `managerId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          managerId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `maxPerUser` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          maxPerUser: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `offerId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          offerId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `platform` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          platform: 'BLC' as 'BLC_UK',
        },
      }),
    );
    test(
      'because the `showQR` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          showQR: 'true' as unknown as boolean,
        },
      }),
    );
    test(
      'because the `terms` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          terms: false as unknown as string,
        },
      }),
    );
    test(
      'because the `ucCampaignId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          ucCampaignId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `vaultStatus` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          vaultStatus: 'true' as unknown as boolean,
        },
      }),
    );
  });
});
