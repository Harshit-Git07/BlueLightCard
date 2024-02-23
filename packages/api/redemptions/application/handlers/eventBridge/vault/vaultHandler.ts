import { EventBridgeEvent } from 'aws-lambda';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { withConnection } from '@blc-mono/redemptions/libs/database/connectionHelpers';

import { vaultCreatedHandler } from './vaultCreatedHandler';
import { vaultUpdatedHandler } from './vaultUpdatedHandler';

type VaultCreatedHandler = typeof vaultCreatedHandler;
type VaultUpdatedHandler = typeof vaultUpdatedHandler;

export function createHandler(
  logger: ILogger,
  vaultCreatedHandler: VaultCreatedHandler,
  vaultUpdatedHandler: VaultUpdatedHandler,
) {
  return async function vaultHandler(
    connection: DatabaseConnection,
    event: EventBridgeEvent<string, unknown>,
  ): Promise<void> {
    const { source } = event;

    switch (source) {
      case RedemptionsDatasyncEvents.VAULT_CREATED:
        await vaultCreatedHandler(connection, logger, event);
        break;
      case RedemptionsDatasyncEvents.VAULT_UPDATED:
        vaultUpdatedHandler();
        break;
      default:
        logger.error({ message: `Invalid Event  ${source}` });
        throw new Error('Invalid event source');
    }
  };
}

const logger = new LambdaLogger({ serviceName: `redemptions-offer-event-handler` });

export const handler = withConnection(
  DatabaseConnectionType.READ_WRITE,
  createHandler(logger, vaultCreatedHandler, vaultUpdatedHandler),
);
