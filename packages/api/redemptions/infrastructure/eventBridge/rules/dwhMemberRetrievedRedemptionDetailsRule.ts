import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';

import { DwhKenisisFirehoseStreams } from '../../../../../../stacks/infra/firehose/DwhKenisisFirehoseStreams';
import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';

/**
 * Creates an event bridge rule which is triggered when a member retrieves redemption details.
 * This is for the datawarehouse (DWH) integration.
 */
export function createDwhMemberRetrievedRedemptionDetailsRule(
  stack: Stack,
  dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams,
): EventBusRuleProps {
  const queue = new Queue(stack, 'DLQRedemptionDwhMemberRetrievedRedemptionDetails');
  const lambda = new SSTFunction(stack, 'dwhMemberRedemptionDetails', {
    handler:
      'packages/api/redemptions/application/handlers/eventBridge/DWH/dwhMemberRetrievedRedemptionDetails.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      // Data Warehouse
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME]:
        dwhKenisisFirehoseStreams.compViewStream.getStreamName(),
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME]:
        dwhKenisisFirehoseStreams.compAppViewStream.getStreamName(),
      // Datadog unified service tracking
      DD_SERVICE: 'redemptions',
    },
    permissions: [
      dwhKenisisFirehoseStreams.compViewStream.getPutRecordPolicyStatement(),
      dwhKenisisFirehoseStreams.compAppViewStream.getPutRecordPolicyStatement(),
    ],
  });
  return {
    pattern: {
      source: [REDEMPTIONS_EVENT_SOURCE],
      detailType: [RedemptionEventDetailType.MEMBER_RETRIEVED_REDEMPTION_DETAILS],
    },
    targets: { dwhTarget: lambda },
  };
}
