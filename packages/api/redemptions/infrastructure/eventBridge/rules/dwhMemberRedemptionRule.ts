import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import {
  REDEMPTION_TYPES,
  RedemptionEventDetailType,
  REDEMPTIONS_EVENT_SOURCE,
} from '@blc-mono/core/constants/redemptions';

import { DwhKenisisFirehoseStreams } from '../../../../../../stacks/infra/firehose/DwhKenisisFirehoseStreams';
import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';

/**
 * Creates an event bridge rule which is triggered when a member retrieves redemption details.
 * This is for the datawarehouse (DWH) integration.
 */
export function createDwhMemberRedemptionRule(
  stack: Stack,
  dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams,
): EventBusRuleProps {
  const queue = new Queue(stack, 'DLQRedemptionDwhMemberRedemption');
  const lambda = new SSTFunction(stack, 'dwhMemberRedemption', {
    handler: 'packages/api/redemptions/application/handlers/eventBridge/DWH/dwhMemberRedemption.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      // Data Warehouse
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME]:
        dwhKenisisFirehoseStreams.vaultStream.getStreamName(),
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_REDEMPTIONS_STREAM_NAME]:
        dwhKenisisFirehoseStreams.redemptionTypeStream.getStreamName(),
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_MEMBER_REDEMPTIONS_STREAM_NAME]:
        dwhKenisisFirehoseStreams.redemptionStream.getStreamName(),
      // Datadog unified service tracking
      DD_SERVICE: 'redemptions',
    },
    permissions: [
      dwhKenisisFirehoseStreams.vaultStream.getPutRecordPolicyStatement(),
      dwhKenisisFirehoseStreams.redemptionTypeStream.getPutRecordPolicyStatement(),
      dwhKenisisFirehoseStreams.redemptionStream.getPutRecordPolicyStatement(),
    ],
  });
  return {
    pattern: {
      source: [REDEMPTIONS_EVENT_SOURCE],
      detailType: [RedemptionEventDetailType.MEMBER_REDEMPTION],
      detail: {
        redemptionDetails: {
          redemptionType: REDEMPTION_TYPES,
        },
      },
    },
    targets: { dwhTarget: lambda },
  };
}
