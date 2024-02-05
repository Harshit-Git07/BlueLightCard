import { sql } from 'drizzle-orm';

import { ILogger } from '@blc-mono/core/src/utils/logger/logger';

import { DatabaseConnection } from '../../../database/connection';
import { createVaultId, redemptionsTable, vaultsTable } from '../../../database/schema';
import { VaultCreatedEventDetail, VaultCreatedEventSchema } from '../../events/vault/vaultEvents';

type NewVault = typeof vaultsTable.$inferInsert;

function parseIntegration(event: VaultCreatedEventDetail): Pick<NewVault, 'integration' | 'integrationId'> {
  switch (true) {
    case Boolean(event.eeCampaignId):
      return {
        integration: 'eagleeye',
        integrationId: event.eeCampaignId ?? null,
      };
    case Boolean(event.ucCampaignId):
      return {
        integration: 'uniqodo',
        integrationId: event.ucCampaignId ?? null,
      };
    default:
      return {
        integration: null,
        integrationId: null,
      };
  }
}

export const vaultCreatedHandler = async ({ db }: DatabaseConnection, logger: ILogger, event: unknown) => {
  const vaultCreatedEvent = VaultCreatedEventSchema.parse(event);
  const eventDetail = vaultCreatedEvent.detail;

  const newVault: Omit<NewVault, 'redemptionId'> = {
    alertBelow: eventDetail.alertBelow,
    status: eventDetail.vaultStatus ? 'active' : 'in-active',
    maxPerUser: eventDetail.maxPerUser,
    showQR: eventDetail.showQR,
    terms: eventDetail.terms,
    email: eventDetail.adminEmail || null,
    ...parseIntegration(eventDetail),
  };

  const query = sql`
    INSERT INTO ${vaultsTable} (
      "${sql.raw(vaultsTable.id.name)}",
      "${sql.raw(vaultsTable.redemptionId.name)}",
      "${sql.raw(vaultsTable.alertBelow.name)}",
      "${sql.raw(vaultsTable.status.name)}",
      "${sql.raw(vaultsTable.maxPerUser.name)}",
      "${sql.raw(vaultsTable.showQR.name)}",
      "${sql.raw(vaultsTable.terms.name)}",
      "${sql.raw(vaultsTable.email.name)}",
      "${sql.raw(vaultsTable.integration.name)}",
      "${sql.raw(vaultsTable.integrationId.name)}"
    )
    SELECT
      ${createVaultId()},
      ${redemptionsTable.id},
      ${newVault.alertBelow},
      ${newVault.status},
      ${newVault.maxPerUser},
      ${newVault.showQR},
      ${newVault.terms},
      ${newVault.email},
      ${newVault.integration},
      ${newVault.integrationId}
    FROM ${redemptionsTable}
    WHERE (
      ${redemptionsTable.companyId} = ${eventDetail.companyId}
      AND ${redemptionsTable.offerId} = ${eventDetail.offerId}
      AND ${redemptionsTable.platform} = ${eventDetail.platform}
    )
    RETURNING (
      ${vaultsTable.id}
    )
  `;
  const results = await db.execute(query);

  if (results.length === 0) {
    logger.error({
      message: 'No redemption found for vault',
      context: {
        offerId: eventDetail.offerId,
        companyId: eventDetail.companyId,
        platform: eventDetail.platform,
      },
    });
  }

  if (results.length > 1) {
    logger.error({
      message: 'Multiple redemptions found for vault',
      context: {
        offerId: eventDetail.offerId,
        companyId: eventDetail.companyId,
        platform: eventDetail.platform,
      },
    });
  }
};
