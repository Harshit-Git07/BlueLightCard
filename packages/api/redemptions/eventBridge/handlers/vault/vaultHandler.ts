import { Logger } from '@blc-mono/core/src/utils/logger/logger';

import { VaultEvents } from '../../events/';
import { IEventBridge } from '../../types/event';

import { vaultCreatedHandler, vaultUpdatedHandler } from './vaultEventHandlers';

const service: string = process.env.service as string;
const logger = new Logger();
logger.init({ serviceName: `${service}-offer-event-handler` });

export const handler = async (event: IEventBridge): Promise<void> => {
  const { source } = event;

  switch (source) {
    case VaultEvents.VAULT_CREATED:
      vaultCreatedHandler();
      break;
    case VaultEvents.VAULT_UPDATED:
      vaultUpdatedHandler();
      break;
    default:
      logger.error({ message: `Invalid Event  ${source}` });
      throw new Error('Invalid event source');
  }
};
