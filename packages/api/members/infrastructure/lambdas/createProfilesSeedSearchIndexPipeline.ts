import { Function, Queue, Stack, Table } from 'sst/constructs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Duration } from 'aws-cdk-lib';

export function createProfilesSeedSearchIndexPipeline(
  stack: Stack,
  profilesTable: Table,
  profilesSeedSearchIndexTable: Table,
): void {
  const profilesSeedSearchIndexTableQueue: Queue = new Queue(
    stack,
    'MemberProfilesSeedSearchIndexTableQueue',
    {
      cdk: {
        queue: {
          deadLetterQueue: {
            queue: new Queue(stack, 'MemberProfilesSeedSearchIndexTableDeadLetterQueue').cdk.queue,
            maxReceiveCount: 3,
          },
          visibilityTimeout: Duration.seconds(60),
        },
      },
    },
  );

  new Function(stack, 'MemberProfileTableReader', {
    handler:
      'packages/api/members/application/handlers/admin/search/memberProfileTableReader.handler',
    bind: [profilesTable, profilesSeedSearchIndexTableQueue],
    timeout: 60,
  });

  const memberProfileSeedSearchIndexTableWriter = new Function(
    stack,
    'MemberProfileSeedSearchIndexTableWriter',
    {
      handler:
        'packages/api/members/application/handlers/admin/search/memberProfileSeedSearchIndexTableWriter.handler',
      bind: [profilesSeedSearchIndexTable],
      timeout: 60,
    },
  );

  memberProfileSeedSearchIndexTableWriter.addEventSource(
    new SqsEventSource(profilesSeedSearchIndexTableQueue.cdk.queue, {
      batchSize: 5,
      maxConcurrency: 5,
    }),
  );

  profilesSeedSearchIndexTableQueue.cdk.queue.grantConsumeMessages(
    memberProfileSeedSearchIndexTableWriter,
  );
}
