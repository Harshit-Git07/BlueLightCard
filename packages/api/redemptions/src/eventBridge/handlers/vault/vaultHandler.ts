import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';

import { DatabaseConnection, DatabaseConnectionType } from '../../../database/connection';
import { withConnection } from '../../../database/connectionHelpers';
import { VaultEvents } from '../../events';
import { IEventBridge } from '../../types/event';

import { vaultCreatedHandler } from './vaultCreatedHandler';
import { vaultUpdatedHandler } from './vaultUpdatedHandler';

type VaultCreatedHandler = typeof vaultCreatedHandler;
type VaultUpdatedHandler = typeof vaultUpdatedHandler;

export function createHandler(
  logger: ILogger,
  vaultCreatedHandler: VaultCreatedHandler,
  vaultUpdatedHandler: VaultUpdatedHandler,
) {
  return async function vaultHandler(connection: DatabaseConnection, event: IEventBridge): Promise<void> {
    const { source } = event;

    switch (source) {
      case VaultEvents.VAULT_CREATED:
        vaultCreatedHandler(connection, logger, event);
        break;
      case VaultEvents.VAULT_UPDATED:
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
