import { Function, Queue, Stack, Table } from 'sst/constructs';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
  MemberStackConfigResolver,
  MemberStackRegion,
} from '@blc-mono/members/infrastructure/config/config';

export function createMemberProfileIndexer(
  stack: Stack,
  vpc: IVpc,
  memberProfilesTableEventQueue: Queue,
  organisationTable: Table,
  service: string,
): void {
  const config = MemberStackConfigResolver.for(stack, stack.region as MemberStackRegion);

  const memberProfileIndexer = new Function(stack, 'MemberProfileIndexer', {
    handler:
      'packages/api/members/application/handlers/admin/opensearch/memberProfileIndexer.handler',
    environment: {
      // TODO: Add OpenSearch domain endpoint once cluster is available
      OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint ?? '',
      STAGE: stack.stage ?? '',
      SERVICE: service,
    },
    permissions: ['es'],
    bind: [organisationTable],
    vpc,
    deadLetterQueueEnabled: true,
  });

  memberProfileIndexer.addEventSource(
    new SqsEventSource(memberProfilesTableEventQueue.cdk.queue, {
      batchSize: 10,
      maxConcurrency: 50,
      // TODO: Enable once initial data ingestion is complete
      enabled: false,
    }),
  );

  memberProfilesTableEventQueue.cdk.queue.grantConsumeMessages(memberProfileIndexer);
}
