import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import {
  RedemptionsVaultBatchEvents,
  UPLOAD_FILE_TYPE,
} from '@blc-mono/redemptions/infrastructure/eventBridge/events/vaultBatch';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { VaultCodesUpload } from '../../s3/vaultCodesUpload';

export function createVaultCodesUploadRule(
  stack: Stack,
  vaultCodesUpload: VaultCodesUpload,
  database: IDatabase,
): EventBusRuleProps {
  const queue = new Queue(stack, 'vaultCodesUploadDeadLetterQueue');
  const vaultCodesUploadHandler = new SSTFunction(stack, 'vaultCodesUploadHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/vaultBatch/vaultCodesUploadHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    permissions: [vaultCodesUpload.setUp.getGetRecordPolicyStatement()],
  });
  return {
    pattern: {
      source: [RedemptionsVaultBatchEvents.UPLOAD_SOURCE],
      detailType: [RedemptionsVaultBatchEvents.UPLOAD_DETAIL_TYPE],
      detail: {
        bucket: {
          name: [vaultCodesUpload.setUp.getBucketName()],
        },
        object: {
          key: [{ suffix: UPLOAD_FILE_TYPE }],
        },
      },
    },
    targets: {
      vaultCodesUploadHandler,
    },
  };
}
