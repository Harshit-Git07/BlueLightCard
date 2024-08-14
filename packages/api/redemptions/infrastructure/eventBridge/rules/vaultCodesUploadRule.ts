import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { VaultCodesUpload } from '../../s3/vaultCodesUpload';
import { RedemptionsVaultBatchEvents, UPLOAD_FILE_TYPE } from '../events/vaultBatch';

export function createVaultCodesUploadRule(
  stack: Stack,
  database: IDatabase,
  vaultCodesUpload: VaultCodesUpload,
  eventBusName: string,
): EventBusRuleProps {
  const putEventsPolicy = new PolicyStatement({
    actions: ['events:PutEvents'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const queue = new Queue(stack, 'vaultCodesUploadDeadLetterQueue');
  const vaultCodesUploadHandler = new SSTFunction(stack, 'vaultCodesUploadHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/vaultBatch/vaultCodesUploadHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME]: eventBusName,
    },
    permissions: [putEventsPolicy, vaultCodesUpload.setUp.getGetRecordPolicyStatement()],
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
