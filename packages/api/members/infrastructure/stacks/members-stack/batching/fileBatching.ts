import { Construct } from 'constructs';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { Buckets } from '@blc-mono/members/infrastructure/stacks/members-stack/s3/buckets';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { Stack } from 'sst/constructs';
import { createInboundBatchFileCron } from '@blc-mono/members/infrastructure/stacks/members-stack/batching/inbound/createInboundBatchFileCron';
import { createInboundBatchFileHandler } from '@blc-mono/members/infrastructure/stacks/members-stack/batching/inbound/createInboundBatchFileHandler';
import { createOutboundBatchFileCron } from '@blc-mono/members/infrastructure/stacks/members-stack/batching/outbound/createOutboundBatchFileCron';
import { createOutboundBatchFileHandler } from '@blc-mono/members/infrastructure/stacks/members-stack/batching/outbound/createOutboundBatchFileHandler';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export class FileBatching extends Construct {
  constructor(stack: Stack, tables: DynamoDbTables, buckets: Buckets) {
    super(stack, 'FileBatching');

    createInboundBatchFileCron(stack, tables);
    createInboundBatchFileHandler(stack, tables, buckets);

    createOutboundBatchFileCron(stack, tables, buckets);
    createOutboundBatchFileHandler(stack, tables, buckets);
  }

  public static isEnabled(): boolean {
    const environmentVariableValue = getEnvOrDefault(
      MemberStackEnvironmentKeys.ENABLE_AUTOMATIC_EXTERNAL_CARD_BATCHING,
      'false',
    );

    return environmentVariableValue !== 'false';
  }
}
