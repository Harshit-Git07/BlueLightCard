import { and, eq } from 'drizzle-orm';

import { ILogger } from '@blc-mono/core/src/utils/logger/logger';

import { DatabaseConnection } from '../../../database/connection';
import { redemptionsTable, vaultsTable } from '../../../database/schema';
import { AffiliateConfigurationHelper } from '../../../helpers/affiliateConfiguration';
import { VaultCreatedEventDetail, VaultCreatedEventSchema } from '../../events/vault/vaultEvents';

type NewVault = typeof vaultsTable.$inferInsert;
type UpdateRedemption = Partial<typeof redemptionsTable.$inferInsert>;

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

function parseRedemptionUpdate(event: VaultCreatedEventDetail): UpdateRedemption {
  if (!event.link) {
    return {
      redemptionType: 'vaultQR',
      connection: 'direct',
      affiliate: null,
      url: null,
    };
  }

  const affiliateConfiguration = new AffiliateConfigurationHelper(event.link).getConfig();

  if (!affiliateConfiguration) {
    return {
      redemptionType: 'vault',
      connection: 'direct',
      affiliate: null,
      url: event.link,
    };
  }

  return {
    redemptionType: 'vault',
    connection: 'affiliate',
    affiliate: affiliateConfiguration.affiliate,
    url: event.link,
  };
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

  const redemptionUpdate = parseRedemptionUpdate(eventDetail);

  await db.transaction(async (tx) => {
    const updatedRedemptions = await tx
      .update(redemptionsTable)
      .set(redemptionUpdate)
      .where(
        and(
          eq(redemptionsTable.companyId, eventDetail.companyId),
          eq(redemptionsTable.offerId, eventDetail.offerId),
          eq(redemptionsTable.platform, eventDetail.platform),
        ),
      )
      .returning({
        id: redemptionsTable.id,
      });

    if (updatedRedemptions.length === 0) {
      logger.error({
        message: 'No redemptions found for vault',
        context: {
          offerId: eventDetail.offerId,
          companyId: eventDetail.companyId,
          platform: eventDetail.platform,
        },
      });
    } else if (updatedRedemptions.length > 1) {
      logger.error({
        message: 'Multiple redemptions found for vault',
        context: {
          offerId: eventDetail.offerId,
          companyId: eventDetail.companyId,
          platform: eventDetail.platform,
          redemptions: updatedRedemptions,
        },
      });
    }

    const createdVaults = await tx
      .insert(vaultsTable)
      .values(
        updatedRedemptions.map((redemption) => ({
          ...newVault,
          redemptionId: redemption.id,
        })),
      )
      .returning({
        id: vaultsTable.id,
      });

    if (createdVaults.length === 0) {
      logger.error({
        message: 'No redemption found for vault',
        context: {
          offerId: eventDetail.offerId,
          companyId: eventDetail.companyId,
          platform: eventDetail.platform,
        },
      });
    } else if (createdVaults.length > 1) {
      logger.error({
        message: 'Multiple redemptions found for vault',
        context: {
          offerId: eventDetail.offerId,
          companyId: eventDetail.companyId,
          platform: eventDetail.platform,
          vaults: createdVaults,
        },
      });
    }
  });
};
