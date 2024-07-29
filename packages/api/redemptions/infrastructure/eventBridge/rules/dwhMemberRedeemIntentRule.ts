import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';

import { DwhKenisisFirehoseStreams } from '../../../../../../stacks/infra/firehose/DwhKenisisFirehoseStreams';
import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';

/**
 * Creates an event bridge rule which is triggered when a member retrieves redemption details.
 * This is for the datawarehouse (DWH) integration.
 */
export function createDwhMemberRedeemIntentRule(
  stack: Stack,
  dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams,
): EventBusRuleProps {
  const queue = new Queue(stack, 'DLQRedemptionDwhMemberRedeemIntent');
  const lambda = new SSTFunction(stack, 'dwhMemberRedeemIntent', {
    handler: 'packages/api/redemptions/application/handlers/eventBridge/DWH/dwhMemberRedeemIntent.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      // Data Warehouse
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME]:
        dwhKenisisFirehoseStreams.compClickStream.getStreamName(),
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME]:
        dwhKenisisFirehoseStreams.compAppClickStream.getStreamName(),
      // Datadog unified service tracking
      DD_SERVICE: 'redemptions',
    },
    permissions: [
      dwhKenisisFirehoseStreams.compClickStream.getPutRecordPolicyStatement(),
      dwhKenisisFirehoseStreams.compAppClickStream.getPutRecordPolicyStatement(),
    ],
  });
  return {
    pattern: {
      source: [REDEMPTIONS_EVENT_SOURCE],
      detailType: [RedemptionEventDetailType.MEMBER_REDEEM_INTENT],
    },
    targets: { dwhTarget: lambda },
  };
}
