import { Function, Queue, Stack, use } from 'sst/constructs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { Shared } from '../../../../../../../../../stacks/stack';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export function createMemberProfileChangeEventReceiver(
  stack: Stack,
  tables: DynamoDbTables,
  queue: Queue,
  openSearchDomain: string,
): void {
  const { vpc } = use(Shared);

  const memberProfileIndexer = new Function(stack, 'MemberProfileIndexer', {
    handler: 'packages/api/members/application/handlers/admin/search/memberProfileIndexer.handler',
    environment: {
      [MemberStackEnvironmentKeys.MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT]: openSearchDomain,
      STAGE: stack.stage ?? '',
      SERVICE: SERVICE_NAME,
    },
    permissions: ['es'],
    bind: [tables.organisationsTable],
    vpc,
    deadLetterQueueEnabled: true,
  });

  memberProfileIndexer.addEventSource(
    new SqsEventSource(queue.cdk.queue, {
      batchSize: 10,
      maxConcurrency: 50,
    }),
  );

  queue.cdk.queue.grantConsumeMessages(memberProfileIndexer);
}
